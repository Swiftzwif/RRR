import { redirect } from 'next/navigation';

// Redirect old raffle URLs to new giveaway page
export default function RaffleRedirect() {
  redirect('/giveaway');
}
