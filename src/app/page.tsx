import {redirect} from 'next/navigation';

// Root path redirects to default locale handled by middleware
export default function RootPage() {
  redirect('/en');
}
