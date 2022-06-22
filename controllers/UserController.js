class UserController {
    constructor(createFormId, updateFormId, tableId) {
        this._formEl = document.getElementById(createFormId);
        this._updateFormEl = document.getElementById(updateFormId);
        this._tableEl = document.getElementById(tableId);

        this.onFormSubmit();
        this.onEdit();
    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', () => {
            this.showCreateForm();
        })

        this._updateFormEl.addEventListener('submit', (event) => {
            event.preventDefault();
            this.changeButtonState(this._updateFormEl)
            let userData = this.getFormValues(this._updateFormEl);

            let tr = this._tableEl.rows[this._updateFormEl.dataset.trIndex];
            tr.dataset.user = JSON.stringify(userData);
        
            tr.innerHTML = `
                <td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${userData.name}</td>
                    <td>${userData.email}</td>
                    <td>${userData.admin ? 'Sim' : 'Não'}</td>
                    <td>${Utils.dateFormat(userData.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

            this.addEventTr(tr);
            this.updateUsersCount();
        });
    }

    addEventTr(tr) {
        tr.querySelector('.btn-edit').addEventListener('click', () => {
            let form = document.querySelector('#form-user-update')
            
            let json = JSON.parse(tr.dataset.user);
            form.dataset.trIndex = tr.sectionRowIndex;
            for (let name in json) {
                let field = form.querySelector(`[name=${name.replace('_', '')}]`);
                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;
                        case 'radio':
                            field = form.querySelector(`[name=${name.replace('_', '')}][value=${json[name]}]`);
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }
            
            this.showUpdateForm();
        })
    }

    showCreateForm() {
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showUpdateForm() {
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

    onFormSubmit() {
        this._formEl.addEventListener('submit', (event) => {
            event.preventDefault();

            this.changeButtonState(this._formEl);            
            let userData = this.getFormValues(this._formEl);
            
            if (!userData) return false;

            this.getPhoto().then((content) => {
                userData.photo = content;
                this.insertToTable(userData);

                this._formEl.reset();
                this.changeButtonState(this._formEl);
            }, (error) => {
                alert(error);
                //console.log(error);
            })
        });
    }

    changeButtonState(form) {
        let button = form.querySelector('[type=submit]');
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

    getFormValues(formEl) {
        let user = {};
        let isValid = true;
        [...formEl.elements].forEach((field) => {
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;

            }        
        });
        
        return isValid ? new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin)
            : false;
    }

    /*validateForm(field) {
        let isValid = true;
        if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
            field.parentElement.classList.add('has-error');
            isValid = false;
        }

        return isValid;
    }*/

    insertToTable(userData) {
        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(userData);

        tr.innerHTML = `
            <td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${userData.name}</td>
                <td>${userData.email}</td>
                <td>${userData.admin ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(userData.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `
        
        this.addEventTr(tr);

        this._tableEl.appendChild(tr);
        this.updateUsersCount();
    }

    updateUsersCount() {
        let totalUsers = 0;
        let totalAdmins = 0;

        [...this._tableEl.children].forEach(tr => {
            totalUsers++;
            let user = JSON.parse(tr.dataset.user);
            if (user._admin) totalAdmins++;
        });

        document.querySelector('#total-users').innerHTML = totalUsers;
        document.querySelector('#total-admins').innerHTML = totalAdmins;
    }
}