import DeleteHiveCard from "../../components/FormsHives/delete-hive"
import ButtonBack from "../../components/buttonBack"

function DeleteHive() {

    return(
        <div className="container-all">
            <div className="w-full max-w-3xl px-4 sm:px-8">
            <ButtonBack title="Deletar colmeia" redirect='/hives'/>
            <DeleteHiveCard/>
            </div>
        </div>
    )
}

export default DeleteHive