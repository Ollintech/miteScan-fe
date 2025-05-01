// src/pages/CreateHive/CreateHive.jsx
import CreateHiveCard from '../../components/FormsHives/create-hive'
import ButtonBack from '../../components/buttonBack'

function CreateHive() {

  return (
    <div className="container-all">
      <div className='w-1/2 max-w-3xl'>
        <ButtonBack title="Cadastro de colmeia" redirect='/hives' />
        <CreateHiveCard />
      </div>
    </div>

  )
}

export default CreateHive
