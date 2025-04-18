const fs = require('fs').promises;
const fsSync = require('fs'); // Import the synchronous fs module

class UserManager {
    constructor(filePath) {
        this.filePath = filePath;
        try {
            this.users = JSON.parse(fsSync.readFileSync(filePath, 'utf-8')); // Use fsSync here
            console.log('Loaded users from file:', this.users); // Debug log
        } catch (error) {
            console.error('Error loading users from file:', error); // Debug log
            this.users = [];
        }
    }

    async loadUsers() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.users = JSON.parse(data);
            console.log('Users loaded successfully:', this.users); // Debug log
        } catch (error) {
            console.error('Error loading users:', error); // Debug log
            this.users = [];
        }
    }

    getUsers() {
        console.log('Returning all users:', this.users); // Debug log
        return this.users;
    }

    async addUser(user) {
        console.log('Adding user:', user); // Debug log
        this.users.push(user);
        await this.saveUsers();
    }

    async saveUsers() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.users, null, 2));
            console.log('Users saved successfully to file:', this.filePath); // Debug log
        } catch (error) {
            console.error('Error saving users:', error); // Debug log
        }
    }

    findUserByUsername(username) {
        console.log('Searching for user by username:', username); // Debug log
        const user = this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
        console.log('User found:', user); // Debug log
        return user;
    }
}

module.exports = UserManager;