class UserController {
    constructor(formId, tableId) {
        this._formEl = document.getElementById(formId);
        this._tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    onSubmit() {
        this._formEl.addEventListener('submit', (event) => {
            event.preventDefault();
            this.addLine(this.getValues());
        });
    }

    getValues() {
        let user = {};

        // CRIA DEPENDÊNCIA COM O ATRIBUTO NAME. RESOLVER ISSO!!
        this._formEl.querySelectorAll('[name]').forEach((field) => {
            user[field.name] = field.value;
        });
        
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    addLine(userData) {
        console.log(userData)
        this._tableEl.innerHTML += `
            <tr>
                <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                <td>${userData.name}</td>
                <td>${userData.email}</td>
                <td>${userData.admin}</td>
                <td>${userData.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
        `
    }
}