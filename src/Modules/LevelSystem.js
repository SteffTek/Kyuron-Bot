/**
 * The LevelSystem class for guildData
 */
module.exports = class LevelSystem {
    /**
     * Creates a new LevelSystem class
     * 
     * @returns {LevelSystem} The LevelSystem class
     */
    constructor(){
        this.xpGain = {"min": 15, "max": 25, "every": 60}
        this.xpBar = {"empty": "▱", "full": "▰", "amount": 20}
        this.blackList = {"enabled": false, "channels": []}
        this.whiteList = {"enabled": false, "channels": []}
        this.roleRewards = []
        this.levelCurve = [5, 2, 50, 100]
        this.users = []
    }

    /**
     * Loads a LevelSystem class from an already existing object
     * 
     * @param {object} obj Levelsystem object
     * @returns {LevelSystem} LevelSystem class
     */
    static load(obj){
        let ls = new this()
        ls.xpGain = obj.xpGain
        ls.xpBar = obj.xpBar
        ls.blackList = obj.blackList
        ls.whiteList = obj.whiteList
        ls.roleRewards = obj.roleRewards
        ls.levelCurve = obj.levelCurve
        ls.users = obj.users
        return ls
    }

    /**
     * Checks if the user is possible to gain XP and if yes, add XP and possible role rewards
     * 
     * @param {string} userID userID of the leveldata user
     * @returns {boolean} if changes were made
     */
    gainXP (userID){
        let index = this.initUser(userID)
        let stamp = + new Date()

        if (stamp > this.users[index].nextGainStamp){
            let randomXP = parseFloat((Math.random() * (this.xpGain.max - this.xpGain.min) + this.xpGain.min).toFixed(2))
            this.users[index].xp += randomXP
            this.users[index].xpGes += randomXP
            this.users[index].nextGainStamp = stamp + this.xpGain.every * 1000

            while (this.checkForLvlUp(index)){
                //levelUp and rolereward check (WIP)
            }
        }else{
            return false
        }
    }

    /**
     * Inits the specified user's leveldata or loads it if it already got initialized
     * 
     * @param {string} userID userID of the leveldata user
     * @returns {number} returns the index of the user's leveldata in the users array of the guild's LevelSystem
     */
    initUser (userID){
        let u = this.users.find(u => u.id === userID)
        if (!u){
            return this.users.push({id: userID, lvl: 0, xp: 0, xpGes: 0, nextGainStamp: 0, rewards: []}) - 1
        }else{
            return this.users.indexOf(u)
        }
    }

    /**
     * Checks if the specified index of this LevelSystem's users is able to level up
     * 
     * @param {number} index index of the leveldata user
     * @returns {boolean} if the user is able to levelup
     */
    checkForLvlUp (index){
        return this.users[index].xp >= this.getRequiredXP(this.users[index].level + 1)
    }

    /**
     * Calculates how much XP is needed to reach a certain level
     * 
     * @param {number} lvl level
     * @returns {number} the amount of XP needed to reach the specified level
     */
    getRequiredXP (lvl){
        return (this.levelCurve[0]*(lvl**this.levelCurve[1])+(this.levelCurve[2]*lvl))+this.levelCurve[3]
    }
}