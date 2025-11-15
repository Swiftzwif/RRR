#!/usr/bin/env python3
"""
Cost Reporter for GitHub Actions AI Team
Generates detailed cost reports and insights
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List, Optional
import yaml


class CostReporter:
    """Generates cost reports for the AI team."""
    
    def __init__(self):
        """Initialize the cost reporter."""
        workspace = os.environ.get('GITHUB_WORKSPACE')
        if workspace:
            self.cost_tracker_path = Path(workspace) / '.github' / 'ai-team' / 'cost-tracker.json'
        else:
            script_dir = Path(__file__).parent
            self.cost_tracker_path = script_dir.parent / 'cost-tracker.json'
        
        self.config_path = Path(__file__).parent.parent / 'configs' / 'main-config.yml'
    
    def load_cost_data(self) -> Dict[str, Any]:
        """Load cost tracking data from JSON file."""
        try:
            if self.cost_tracker_path.exists():
                with open(self.cost_tracker_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f'Error loading cost data: {e}', file=sys.stderr)
        return {'daily': {}, 'monthly': {}, 'bots': {}}
    
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file."""
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    
    def generate_report(self, period: str = 'daily') -> Dict[str, Any]:
        """Generate cost report for the specified period."""
        cost_data = self.load_cost_data()
        config = self.load_config()
        
        now = datetime.now()
        report = {
            'generated': now.isoformat(),
            'period': period,
            'budget': config['budget'],
            'data': {}
        }
        
        if period == 'daily':
            report['data'] = self.generate_daily_report(cost_data, now)
        elif period == 'weekly':
            report['data'] = self.generate_weekly_report(cost_data, now)
        elif period == 'monthly':
            report['data'] = self.generate_monthly_report(cost_data, now)
        else:
            raise ValueError(f'Unknown period: {period}')
        
        return report
    
    def generate_daily_report(self, cost_data: Dict[str, Any], now: datetime) -> Dict[str, Any]:
        """Generate daily cost report."""
        today = now.strftime('%Y-%m-%d')
        daily_data = cost_data.get('daily', {}).get(today, {'total': 0.0, 'bots': {}})
        
        return {
            'date': today,
            'total': daily_data.get('total', 0.0),
            'bots': daily_data.get('bots', {}),
            'top_spenders': self.get_top_spenders(daily_data.get('bots', {}), 5),
            'alerts': self.check_daily_alerts(daily_data)
        }
    
    def generate_weekly_report(self, cost_data: Dict[str, Any], now: datetime) -> Dict[str, Any]:
        """Generate weekly cost report."""
        week_data = {'total': 0.0, 'bots': {}, 'days': {}}
        
        # Get last 7 days
        for i in range(7):
            date = now - timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            
            if date_str in cost_data.get('daily', {}):
                day_data = cost_data['daily'][date_str]
                week_data['total'] += day_data.get('total', 0.0)
                week_data['days'][date_str] = day_data.get('total', 0.0)
                
                # Aggregate bot costs
                for bot, cost in day_data.get('bots', {}).items():
                    week_data['bots'][bot] = week_data['bots'].get(bot, 0.0) + cost
        
        start_date = (now - timedelta(days=6)).strftime('%Y-%m-%d')
        end_date = now.strftime('%Y-%m-%d')
        
        return {
            'start_date': start_date,
            'end_date': end_date,
            'total': week_data['total'],
            'daily_average': week_data['total'] / 7,
            'bots': week_data['bots'],
            'top_spenders': self.get_top_spenders(week_data['bots'], 5),
            'daily_breakdown': week_data['days'],
            'trend': self.calculate_trend(week_data['days'])
        }
    
    def generate_monthly_report(self, cost_data: Dict[str, Any], now: datetime) -> Dict[str, Any]:
        """Generate monthly cost report."""
        current_month = now.strftime('%Y-%m')
        month_data = cost_data.get('monthly', {}).get(current_month, {'total': 0.0, 'bots': {}})
        
        # Calculate projection
        day_of_month = now.day
        # Get days in month
        if now.month == 12:
            next_month = now.replace(year=now.year + 1, month=1, day=1)
        else:
            next_month = now.replace(month=now.month + 1, day=1)
        days_in_month = (next_month - timedelta(days=1)).day
        projected_total = (month_data.get('total', 0.0) / day_of_month) * days_in_month if day_of_month > 0 else 0.0
        
        return {
            'month': current_month,
            'total': month_data.get('total', 0.0),
            'projected': projected_total,
            'remaining': 100.0 - month_data.get('total', 0.0),  # Assuming $100 budget
            'bots': month_data.get('bots', {}),
            'top_spenders': self.get_top_spenders(month_data.get('bots', {}), 10),
            'budget_status': self.get_budget_status(month_data.get('total', 0.0), projected_total),
            'recommendations': self.get_recommendations(month_data, projected_total)
        }
    
    def get_top_spenders(self, bots: Dict[str, float], limit: int) -> List[Dict[str, Any]]:
        """Get top spending bots with percentages."""
        total = sum(bots.values())
        
        # Guard against division by zero
        if total == 0:
            return []
        
        sorted_bots = sorted(bots.items(), key=lambda x: x[1], reverse=True)
        return [
            {
                'bot': bot,
                'cost': cost,
                'percentage': f'{(cost / total * 100):.1f}'
            }
            for bot, cost in sorted_bots[:limit]
        ]
    
    def check_daily_alerts(self, daily_data: Dict[str, Any]) -> List[Dict[str, str]]:
        """Check for daily spending alerts."""
        alerts = []
        total = daily_data.get('total', 0.0)
        
        if total > 5:
            alerts.append({
                'level': 'warning',
                'message': f'Daily spend (${total:.2f}) exceeds $5 threshold'
            })
        
        # Check for unusual bot activity
        for bot, cost in daily_data.get('bots', {}).items():
            if cost > 2:
                alerts.append({
                    'level': 'info',
                    'message': f'{bot} spent ${cost:.2f} today (above $2 threshold)'
                })
        
        return alerts
    
    def calculate_trend(self, daily_data: Dict[str, float]) -> str:
        """Calculate spending trend."""
        values = list(daily_data.values())
        if len(values) < 2:
            return 'insufficient_data'
        
        mid = len(values) // 2
        first_half = values[:mid]
        second_half = values[mid:]
        
        first_avg = sum(first_half) / len(first_half) if first_half else 0
        second_avg = sum(second_half) / len(second_half) if second_half else 0
        
        if first_avg == 0:
            return 'insufficient_data'
        
        change = ((second_avg - first_avg) / first_avg) * 100
        
        if change > 20:
            return 'increasing_rapidly'
        elif change > 5:
            return 'increasing'
        elif change < -20:
            return 'decreasing_rapidly'
        elif change < -5:
            return 'decreasing'
        else:
            return 'stable'
    
    def get_budget_status(self, current: float, projected: float) -> Dict[str, Any]:
        """Get budget status information."""
        budget = 100.0  # $100 monthly budget
        percent_used = (current / budget) * 100 if budget > 0 else 0
        projected_percent = (projected / budget) * 100 if budget > 0 else 0
        
        # Calculate days remaining in month
        now = datetime.now()
        if now.month == 12:
            next_month = now.replace(year=now.year + 1, month=1, day=1)
        else:
            next_month = now.replace(month=now.month + 1, day=1)
        days_in_month = (next_month - timedelta(days=1)).day
        days_remaining = days_in_month - now.day
        
        if projected_percent > 100:
            status = 'over_budget'
        elif projected_percent > 90:
            status = 'near_limit'
        elif projected_percent > 75:
            status = 'on_track'
        else:
            status = 'under_budget'
        
        return {
            'percent_used': f'{percent_used:.1f}',
            'projected_percent': f'{projected_percent:.1f}',
            'status': status,
            'days_remaining': days_remaining
        }
    
    def get_recommendations(self, month_data: Dict[str, Any], projected_total: float) -> List[Dict[str, str]]:
        """Get cost optimization recommendations."""
        recommendations = []
        budget = 100.0
        
        if projected_total > budget * 1.1:
            recommendations.append({
                'priority': 'high',
                'action': 'Reduce usage of expensive models',
                'impact': f'Could save ${((projected_total - budget) * 0.5):.2f}'
            })
        
        # Find expensive bots
        bots = month_data.get('bots', {})
        expensive_bots = [
            bot for bot, cost in bots.items()
            if cost > budget * 0.2
        ]
        
        if expensive_bots:
            recommendations.append({
                'priority': 'medium',
                'action': f'Optimize {", ".join(expensive_bots)} - using >20% of budget each',
                'impact': 'Better cost distribution'
            })
        
        if projected_total < budget * 0.5:
            recommendations.append({
                'priority': 'low',
                'action': 'Consider using more capable models for better results',
                'impact': 'Improved quality without exceeding budget'
            })
        
        return recommendations
    
    def format_markdown_report(self, report: Dict[str, Any]) -> str:
        """Format report as Markdown."""
        markdown = f"# 💰 AI Team Cost Report\n\n"
        generated_time = datetime.fromisoformat(report['generated']).strftime('%Y-%m-%d %H:%M:%S')
        markdown += f"**Generated**: {generated_time}\n"
        markdown += f"**Period**: {report['period']}\n"
        markdown += f"**Budget**: ${report['budget']['monthly_limit']}/month\n\n"
        
        data = report['data']
        period = report['period']
        
        if period == 'daily':
            markdown += f"## 📊 Daily Report ({data['date']})\n\n"
            markdown += f"**Total Spend**: ${data['total']:.2f}\n\n"
            
            if data['top_spenders']:
                markdown += "### 🏆 Top Spenders\n\n"
                markdown += "| Bot | Cost | % of Total |\n"
                markdown += "|-----|------|------------|\n"
                for spender in data['top_spenders']:
                    markdown += f"| {spender['bot']} | ${spender['cost']:.2f} | {spender['percentage']}% |\n"
                markdown += "\n"
            
            if data['alerts']:
                markdown += "### ⚠️ Alerts\n\n"
                for alert in data['alerts']:
                    markdown += f"- **{alert['level'].upper()}**: {alert['message']}\n"
        
        elif period == 'weekly':
            markdown += f"## 📊 Weekly Report ({data['start_date']} to {data['end_date']})\n\n"
            markdown += f"**Total Spend**: ${data['total']:.2f}\n"
            markdown += f"**Daily Average**: ${data['daily_average']:.2f}\n"
            markdown += f"**Trend**: {data['trend'].replace('_', ' ')}\n\n"
            
            markdown += "### 📈 Daily Breakdown\n\n"
            markdown += "```\n"
            for date, cost in sorted(data['daily_breakdown'].items()):
                bar = '█' * int(cost * 2)
                markdown += f"{date}: {bar} ${cost:.2f}\n"
            markdown += "```\n\n"
            
            if data['top_spenders']:
                markdown += "### 🏆 Top Spenders\n\n"
                markdown += "| Bot | Cost | % of Total |\n"
                markdown += "|-----|------|------------|\n"
                for spender in data['top_spenders']:
                    markdown += f"| {spender['bot']} | ${spender['cost']:.2f} | {spender['percentage']}% |\n"
        
        elif period == 'monthly':
            markdown += f"## 📊 Monthly Report ({data['month']})\n\n"
            markdown += f"**Current Spend**: ${data['total']:.2f} ({data['budget_status']['percent_used']}% of budget)\n"
            markdown += f"**Projected Total**: ${data['projected']:.2f} ({data['budget_status']['projected_percent']}%)\n"
            markdown += f"**Budget Status**: {data['budget_status']['status'].replace('_', ' ').upper()}\n"
            markdown += f"**Days Remaining**: {data['budget_status']['days_remaining']}\n\n"
            
            # Visual budget bar
            used = int(float(data['budget_status']['percent_used']) / 5)
            projected = int(float(data['budget_status']['projected_percent']) / 5)
            markdown += "### 💵 Budget Visualization\n\n"
            markdown += f"Current:   {'█' * used}{'░' * (20 - used)} {data['budget_status']['percent_used']}%\n"
            markdown += f"Projected: {'█' * projected}{'░' * (20 - projected)} {data['budget_status']['projected_percent']}%\n\n"
            
            if data['top_spenders']:
                markdown += "### 🏆 Top Spending Bots\n\n"
                markdown += "| Bot | Cost | % of Total |\n"
                markdown += "|-----|------|------------|\n"
                for spender in data['top_spenders']:
                    markdown += f"| {spender['bot']} | ${spender['cost']:.2f} | {spender['percentage']}% |\n"
                markdown += "\n"
            
            if data['recommendations']:
                markdown += "### 💡 Recommendations\n\n"
                for rec in data['recommendations']:
                    markdown += f"**{rec['priority'].upper()}**: {rec['action']}\n"
                    markdown += f"- Impact: {rec['impact']}\n\n"
        
        repository = os.environ.get('GITHUB_REPOSITORY', 'owner/repo')
        markdown += "\n---\n"
        markdown += f"*Cost tracking by CFO Bot • [View Full Dashboard](https://github.com/{repository}/actions/workflows/cost-tracker.yml)*"
        
        return markdown


def main():
    """CLI interface."""
    period = sys.argv[1] if len(sys.argv) > 1 else 'daily'
    
    reporter = CostReporter()
    try:
        report = reporter.generate_report(period)
        markdown = reporter.format_markdown_report(report)
        print(markdown)
        sys.exit(0)
    except Exception as error:
        print(f'Error generating report: {error}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()

