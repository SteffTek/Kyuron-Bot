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
}