import EditUserCard from "../../../components/user/edit-user.jsx"
import ButtonBack from "../../../components/buttonBack"

function EditUser() {

    return (
        <div className="container-all">
            <div className="w-full max-w-3xl px-4 sm:px-8 mt-5">
                <ButtonBack title="Editar dados do usuário" redirect='/users' />
                <EditUserCard />
            </div>
        </div>
    )
}

export default EditUser