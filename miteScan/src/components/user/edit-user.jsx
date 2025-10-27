import { useParams } from 'react-router-dom';
import UserForm from './user-form';

export default function EditUserWrapper() {
  const { id } = useParams();
  return <UserForm mode="edit" userId={id} />;
}
