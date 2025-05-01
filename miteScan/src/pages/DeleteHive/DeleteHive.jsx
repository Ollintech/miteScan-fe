import DeleteHiveCard from "../../components/FormsHives/delete-hive"
import ButtonBack from "../../components/buttonBack"

function DeleteHive() {

    return(
        <div className="container-all">
            <div className="w-2/5 max-w-3xl min-w-xl">
            <ButtonBack title="Deletar colmeia" redirect='/hives'/>
            <DeleteHiveCard/>
            </div>
        </div>
    )
}

export default DeleteHive