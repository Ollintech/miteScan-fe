// src/pages/CreateHive/CreateHive.jsx
import CreateHiveCard from '../../components/FormsHives/create-hive'
import ButtonBack from '../../components/buttonBack'

function CreateHive() {

  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8 mt-3'>
        <ButtonBack title="Cadastro de colmeia" redirect='/hives' />
        <CreateHiveCard />
      </div>
    </div>

  )
}

export default CreateHive
