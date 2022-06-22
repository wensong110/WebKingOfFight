class PVPGameMode{
    constructor(){
        this.gamePlay=new KingOfFight()
    }

    start(){
        this.kCanvas = new KCanvasObject(this.gamePlay)
    }

}