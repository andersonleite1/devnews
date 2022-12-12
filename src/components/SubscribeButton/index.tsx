import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const {status} = useSession();

  function handleSubscribe() {
    if (status !== 'authenticated') {
      signIn('github');
      return;
    }
    console.log('Subscribe');
    
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
