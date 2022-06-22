class UserController {
    constructor(formId, tableId) {
        this._formEl = document.getElementById(formId);
        this._tableEl = document.getElementById(tableId);

        this.onFormSubmit();
    }

    onFormSubmit() {
        this._formEl.addEventListener('submit', (event) => {
            event.preventDefault();

            this.changeButtonState();            
            let userData = this.getFormValues();
            
            this.getPhoto().then((content) => {
                userData.photo = content;
                this.insertToTable(userData);

                this._formEl.reset();
                this.changeButtonState();
            }, (error) => {
                alert(error);
                //console.log(error);
            })
        });
    }

    changeButtonState() {
        let button = this._formEl.querySelector('[type=submit]');
        button.disabled ? false : true;
    }

    getPhoto() {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            let photo = [...this._formEl.elements].filter(item => {
                return (item.name === 'photo') ? item : false;
            })

            fileReader.onload = () => {
                resolve(fileReader.result)
            };

            fileReader.onerror = (error) => {
                reject(error);
            }

            let file = photo[0].files[0];
            file ? fileReader.readAsDataURL(file) : resolve('dist/img/boxed-bg.jpg');
        });
    }

    getFormValues() {
        let user = {};
        let isValid = true;
        [...this._formEl.elements].forEach((field) => {
            if (this.validateForm(field)) {
                user[field.name] = field.value;
                if (field.name === 'admin') user[field.name] = field.checked;
            }

            isValid = false;
            return false;
        });
        
        return isValid ? new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin)
            : false;
    }

    validateForm(field) {
        let isValid = true;
        if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
            field.parentElement.classList.add('has-error');
            isValid = false;
        }

        return isValid;
    }

    insertToTable(userData) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${userData.name}</td>
                <td>${userData.email}</td>
                <td>${userData.admin ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(userData.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `

        this._tableEl.appendChild(tr);
    }
}