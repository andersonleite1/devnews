import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';
import useWindowDimensions from '../../hooks/useWindowDimensions';

import styles from './styles.module.scss';

export function SignInButton() {
  const {data: session} = useSession();
  const { name } = session?.user || {};
  let { width } = useWindowDimensions();
 
  if (!width) width = 0;
  

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      { width > 560 ? name : 'Sair'}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button 
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#6C63FF" />
      {width > 560 ? 'Entrar com Github' : 'Entrar'}
    </button>
  );
}
