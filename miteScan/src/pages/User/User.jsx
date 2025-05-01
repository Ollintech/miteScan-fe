import UserCard from '../../components/User/user-card';
import ButtonBack from '../../components/buttonBack';

function User() {

  return (
    <div className="container-all">
      <div className='w-2/5 max-w-3xl min-w-lg'>
        <ButtonBack title="meus dados" redirect='/home' />
        <UserCard />
      </div>
    </div>
  );
}

export default User;
