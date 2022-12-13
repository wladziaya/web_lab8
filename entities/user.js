class User {

    constructor(firstName, lastName, username, password, group, variant, id=undefined) {
        this.firstName = firstName
        this.lastName = lastName
        this.username = username
        this.password = password
        this.group = group
        this.variant = variant
        this.id = id
    }

}

module.exports = User
