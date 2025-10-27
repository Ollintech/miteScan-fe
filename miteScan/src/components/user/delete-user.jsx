import { useParams } from 'react-router-dom';
import UserForm from './user-form';

export default function DeleteUserWrapper() {
  const { id } = useParams();
  return <UserForm mode="delete" userId={id} />;
}
