import DeleteUserCard from "../../../components/user/delete-user.jsx"
import ButtonBack from "../../../components/buttonBack"

function DeleteUser() {

    return (
        <div className="container-all">
            <div className="w-full max-w-3xl px-4 sm:px-8 mt-5">
                <ButtonBack title="Deletar dados do usuário" redirect='/users' />
                <DeleteUserCard />
            </div>
        </div>
    )
}

export default DeleteUser