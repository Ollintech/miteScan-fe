import UserCard from '../../components/User/user-card';
import ButtonBack from '../../components/buttonBack';

function User() {

  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8 mb-10'>
        <ButtonBack title="meus dados" redirect='/home' />
        <UserCard />
      </div>
    </div>
  );
}

export default User;
