import EditHiveCard from "../../components/FormsHives/edit-hive"
import ButtonBack from "../../components/buttonBack"

function EditHive() {

    return (
        <div className="container-all">
            <div className="w-full max-w-3xl px-4 sm:px-8 mt-20">
                <ButtonBack title="Editar dados da colmeia" redirect='/hives' />
                <EditHiveCard />
            </div>
        </div>
    )
}

export default EditHive