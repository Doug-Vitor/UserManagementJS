class User {
    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id() { return this._id; }

    get name() { return this._name; }
    get gender() { return this._gender; }
    get birth() { return this._birth; }
    get country() { return this._country; }
    get email() { return this._email; }
    get password() { return this._password; }

    get photo() { return this._photo; }
    set photo(value) { this._photo = value; }

    get admin() { return this._admin; }
    get register() { return this._register; }
    
    loadFromJSON(json) {
        for (let key in json) {
            switch(key) {
                case '_register':
                    this[key] = new Date(json[key]);
                    break;
                default:
                    this[key] = json[key];
                    break;
            }
        }
    }

    getNewId() {
        if (!window.id) window.id = 0;
        id++

        return id;
    }

    static getUsersInStorage() {
        let users = [];
        let items = localStorage.getItem('users');

        if (items)
            users = JSON.parse(items);

        return users;
    }

    saveInStorage() {
        let users = User.getUsersInStorage();

        if (this.id > 0) {
            users.map(user => {
                if (user._id == this.id)
                    Object.assign(user, this);
                return user;
            });
        } else {
            this._id = this.getNewId();
            users.push(this);
        }

        localStorage.setItem('users', JSON.stringify(users));
    }
}