#!/usr/bin/env node

/**
 * Cost Reporter for GitHub Actions AI Team
 * Generates detailed cost reports and insights
 */

const fs = require('fs');
const path = require('path');

class CostReporter {
  constructor() {
    this.costTrackerPath = process.env.GITHUB_WORKSPACE 
      ? path.join(process.env.GITHUB_WORKSPACE, '.github/ai-team/cost-tracker.json')
      : path.join(__dirname, '../cost-tracker.json');
      
    this.configPath = path.join(__dirname, '../configs/main-config.yml');
  }
  
  generateReport(period = 'daily') {
    const costData = this.loadCostData();
    const config = this.loadConfig();
    
    const now = new Date();
    const report = {
      generated: now.toISOString(),
      period: period,
      budget: config.budget,
      data: {}
    };
    
    switch (period) {
      case 'daily':
        report.data = this.generateDailyReport(costData, now);
        break;
      case 'weekly':
        report.data = this.generateWeeklyReport(costData, now);
        break;
      case 'monthly':
        report.data = this.generateMonthlyReport(costData, now);
        break;
      default:
        throw new Error(`Unknown period: ${period}`);
    }
    
    return report;
  }
  
  generateDailyReport(costData, now) {
    const today = now.toISOString().slice(0, 10);
    const dailyData = costData.daily[today] || { total: 0, bots: {} };
    
    return {
      date: today,
      total: dailyData.total,
      bots: dailyData.bots,
      topSpenders: this.getTopSpenders(dailyData.bots, 5),
      alerts: this.checkDailyAlerts(dailyData)
    };
  }
  
  generateWeeklyReport(costData, now) {
    const weekData = { total: 0, bots: {}, days: {} };
    
    // Get last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      
      if (costData.daily[dateStr]) {
        weekData.total += costData.daily[dateStr].total;
        weekData.days[dateStr] = costData.daily[dateStr].total;
        
        // Aggregate bot costs
        for (const [bot, cost] of Object.entries(costData.daily[dateStr].bots)) {
          weekData.bots[bot] = (weekData.bots[bot] || 0) + cost;
        }
      }
    }
    
    return {
      startDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10),
      total: weekData.total,
      dailyAverage: weekData.total / 7,
      bots: weekData.bots,
      topSpenders: this.getTopSpenders(weekData.bots, 5),
      dailyBreakdown: weekData.days,
      trend: this.calculateTrend(weekData.days)
    };
  }
  
  generateMonthlyReport(costData, now) {
    const currentMonth = now.toISOString().slice(0, 7);
    const monthData = costData.monthly[currentMonth] || { total: 0, bots: {} };
    
    // Calculate projection
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const projectedTotal = (monthData.total / dayOfMonth) * daysInMonth;
    
    return {
      month: currentMonth,
      total: monthData.total,
      projected: projectedTotal,
      remaining: 100 - monthData.total, // Assuming $100 budget
      bots: monthData.bots,
      topSpenders: this.getTopSpenders(monthData.bots, 10),
      budgetStatus: this.getBudgetStatus(monthData.total, projectedTotal),
      recommendations: this.getRecommendations(monthData, projectedTotal)
    };
  }
  
  getTopSpenders(bots, limit) {
    const total = Object.values(bots).reduce((a, b) => a + b, 0);
    
    // Guard against division by zero when bots object is empty
    if (total === 0) {
      return [];
    }
    
    return Object.entries(bots)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([bot, cost]) => ({ bot, cost, percentage: (cost / total * 100).toFixed(1) }));
  }
  
  checkDailyAlerts(dailyData) {
    const alerts = [];
    
    if (dailyData.total > 5) {
      alerts.push({
        level: 'warning',
        message: `Daily spend ($${dailyData.total.toFixed(2)}) exceeds $5 threshold`
      });
    }
    
    // Check for unusual bot activity
    for (const [bot, cost] of Object.entries(dailyData.bots)) {
      if (cost > 2) {
        alerts.push({
          level: 'info',
          message: `${bot} spent $${cost.toFixed(2)} today (above $2 threshold)`
        });
      }
    }
    
    return alerts;
  }
  
  calculateTrend(dailyData) {
    const values = Object.values(dailyData);
    if (values.length < 2) return 'insufficient_data';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 20) return 'increasing_rapidly';
    if (change > 5) return 'increasing';
    if (change < -20) return 'decreasing_rapidly';
    if (change < -5) return 'decreasing';
    return 'stable';
  }
  
  getBudgetStatus(current, projected) {
    const budget = 100; // $100 monthly budget
    const percentUsed = (current / budget) * 100;
    const projectedPercent = (projected / budget) * 100;
    
    return {
      percentUsed: percentUsed.toFixed(1),
      projectedPercent: projectedPercent.toFixed(1),
      status: projectedPercent > 100 ? 'over_budget' : 
              projectedPercent > 90 ? 'near_limit' :
              projectedPercent > 75 ? 'on_track' : 'under_budget',
      daysRemaining: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()
    };
  }
  
  getRecommendations(monthData, projectedTotal) {
    const recommendations = [];
    const budget = 100;
    
    if (projectedTotal > budget * 1.1) {
      recommendations.push({
        priority: 'high',
        action: 'Reduce usage of expensive models',
        impact: 'Could save $' + ((projectedTotal - budget) * 0.5).toFixed(2)
      });
    }
    
    // Find expensive bots
    const expensiveBots = Object.entries(monthData.bots)
      .filter(([, cost]) => cost > budget * 0.2)
      .map(([bot]) => bot);
      
    if (expensiveBots.length > 0) {
      recommendations.push({
        priority: 'medium',
        action: `Optimize ${expensiveBots.join(', ')} - using >20% of budget each`,
        impact: 'Better cost distribution'
      });
    }
    
    if (projectedTotal < budget * 0.5) {
      recommendations.push({
        priority: 'low',
        action: 'Consider using more capable models for better results',
        impact: 'Improved quality without exceeding budget'
      });
    }
    
    return recommendations;
  }
  
  formatMarkdownReport(report) {
    let markdown = `# 💰 AI Team Cost Report\n\n`;
    markdown += `**Generated**: ${new Date(report.generated).toLocaleString()}\n`;
    markdown += `**Period**: ${report.period}\n`;
    markdown += `**Budget**: $${report.budget.monthly_limit}/month\n\n`;
    
    const data = report.data;
    
    switch (report.period) {
      case 'daily':
        markdown += `## 📊 Daily Report (${data.date})\n\n`;
        markdown += `**Total Spend**: $${data.total.toFixed(2)}\n\n`;
        
        if (data.topSpenders.length > 0) {
          markdown += `### 🏆 Top Spenders\n\n`;
          markdown += `| Bot | Cost | % of Total |\n`;
          markdown += `|-----|------|------------|\n`;
          data.topSpenders.forEach(s => {
            markdown += `| ${s.bot} | $${s.cost.toFixed(2)} | ${s.percentage}% |\n`;
          });
          markdown += `\n`;
        }
        
        if (data.alerts.length > 0) {
          markdown += `### ⚠️ Alerts\n\n`;
          data.alerts.forEach(alert => {
            markdown += `- **${alert.level.toUpperCase()}**: ${alert.message}\n`;
          });
        }
        break;
        
      case 'weekly':
        markdown += `## 📊 Weekly Report (${data.startDate} to ${data.endDate})\n\n`;
        markdown += `**Total Spend**: $${data.total.toFixed(2)}\n`;
        markdown += `**Daily Average**: $${data.dailyAverage.toFixed(2)}\n`;
        markdown += `**Trend**: ${data.trend.replace(/_/g, ' ')}\n\n`;
        
        markdown += `### 📈 Daily Breakdown\n\n`;
        markdown += `\`\`\`\n`;
        Object.entries(data.dailyBreakdown).forEach(([date, cost]) => {
          const bar = '█'.repeat(Math.round(cost * 2));
          markdown += `${date}: ${bar} $${cost.toFixed(2)}\n`;
        });
        markdown += `\`\`\`\n\n`;
        
        if (data.topSpenders.length > 0) {
          markdown += `### 🏆 Top Spenders\n\n`;
          markdown += `| Bot | Cost | % of Total |\n`;
          markdown += `|-----|------|------------|\n`;
          data.topSpenders.forEach(s => {
            markdown += `| ${s.bot} | $${s.cost.toFixed(2)} | ${s.percentage}% |\n`;
          });
        }
        break;
        
      case 'monthly':
        markdown += `## 📊 Monthly Report (${data.month})\n\n`;
        markdown += `**Current Spend**: $${data.total.toFixed(2)} (${data.budgetStatus.percentUsed}% of budget)\n`;
        markdown += `**Projected Total**: $${data.projected.toFixed(2)} (${data.budgetStatus.projectedPercent}%)\n`;
        markdown += `**Budget Status**: ${data.budgetStatus.status.replace(/_/g, ' ').toUpperCase()}\n`;
        markdown += `**Days Remaining**: ${data.budgetStatus.daysRemaining}\n\n`;
        
        // Visual budget bar
        const used = Math.round(parseFloat(data.budgetStatus.percentUsed) / 5);
        const projected = Math.round(parseFloat(data.budgetStatus.projectedPercent) / 5);
        markdown += `### 💵 Budget Visualization\n\n`;
        markdown += `Current:   ${'█'.repeat(used)}${'░'.repeat(20 - used)} ${data.budgetStatus.percentUsed}%\n`;
        markdown += `Projected: ${'█'.repeat(projected)}${'░'.repeat(20 - projected)} ${data.budgetStatus.projectedPercent}%\n\n`;
        
        if (data.topSpenders.length > 0) {
          markdown += `### 🏆 Top Spending Bots\n\n`;
          markdown += `| Bot | Cost | % of Total |\n`;
          markdown += `|-----|------|------------|\n`;
          data.topSpenders.forEach(s => {
            markdown += `| ${s.bot} | $${s.cost.toFixed(2)} | ${s.percentage}% |\n`;
          });
          markdown += `\n`;
        }
        
        if (data.recommendations.length > 0) {
          markdown += `### 💡 Recommendations\n\n`;
          data.recommendations.forEach(rec => {
            markdown += `**${rec.priority.toUpperCase()}**: ${rec.action}\n`;
            markdown += `- Impact: ${rec.impact}\n\n`;
          });
        }
        break;
    }
    
    markdown += `\n---\n`;
    markdown += `*Cost tracking by CFO Bot • [View Full Dashboard](https://github.com/${process.env.GITHUB_REPOSITORY}/actions/workflows/cost-tracker.yml)*`;
    
    return markdown;
  }
  
  loadCostData() {
    try {
      if (fs.existsSync(this.costTrackerPath)) {
        return JSON.parse(fs.readFileSync(this.costTrackerPath, 'utf8'));
      }
    } catch (e) {
      console.error('Error loading cost data:', e.message);
    }
    return { daily: {}, monthly: {}, bots: {} };
  }
  
  loadConfig() {
    const yaml = require('js-yaml');
    const configContent = fs.readFileSync(this.configPath, 'utf8');
    return yaml.load(configContent);
  }
}

// Export for use in workflows
module.exports = CostReporter;

// CLI interface
if (require.main === module) {
  const reporter = new CostReporter();
  const period = process.argv[2] || 'daily';
  
  try {
    const report = reporter.generateReport(period);
    const markdown = reporter.formatMarkdownReport(report);
    console.log(markdown);
  } catch (error) {
    console.error('Error generating report:', error.message);
    process.exit(1);
  }
}
