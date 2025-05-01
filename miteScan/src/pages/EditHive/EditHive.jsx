import EditHiveCard from "../../components/FormsHives/edit-hive"
import ButtonBack from "../../components/buttonBack"

function EditHive() {

    return (
        <div className="container-all">
            <div className="w-2/5 max-w-3xl min-w-xl mt-20">
                <ButtonBack title="Editar dados da colmeia" redirect='/hives' />
                <EditHiveCard />
            </div>
        </div>
    )
}

export default EditHive