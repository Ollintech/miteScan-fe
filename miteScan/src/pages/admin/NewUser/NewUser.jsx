import NewUserCard from "../../../components/user/user-card.jsx"
import ButtonBack from "../../../components/buttonBack"

function NewUser() {

    return (
        <div className="container-all">
            <div className="w-full max-w-3xl px-4 sm:px-8 mt-5">
                <ButtonBack title="Cadastrar novo usuário" redirect='/users' />
                <NewUserCard />
            </div>
        </div>
    )
}

export default NewUser