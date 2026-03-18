import { _decorator, BoxCollider2D, Component, find, Game, instantiate, Label, macro, Node, Prefab, random, randomRange, randomRangeInt, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;
    @property([String])
    workNameArray: string[] = [];

    @property(Prefab)
    workLabelPrefab: Prefab;
    //使用过的索引
    private usedIndex: Set<number> = new Set<number>();

    public static get instance(): GameManager {
        return GameManager._instance;
    }
    protected onLoad(): void {
        if (!GameManager._instance) {
            GameManager._instance = this;//这里的this是 加载场景的时候 挂载到节点的时候实例化的对象
        }
    }
    protected start(): void {
        // this.schedule(this.instantiateLabel,0.5, 1, macro.REPEAT_FOREVER);
        this.schedule(this.instantiateLabel.bind(this), 1, macro.REPEAT_FOREVER);
    }
    private instantiateLabel() {
        if (this.usedIndex.size == this.workNameArray.length) return;

        let rd: number = randomRangeInt(0, this.workNameArray.length);
        if (this.usedIndex.has(rd)) return;
        this.usedIndex.add(rd);
        let worklabelNode = instantiate(this.workLabelPrefab);
        worklabelNode.getComponent(BoxCollider2D).size.width = worklabelNode.getComponent(UITransform).contentSize.width;
        worklabelNode.getComponent(BoxCollider2D).size.height = worklabelNode.getComponent(UITransform).contentSize.height;
        worklabelNode.getComponent(BoxCollider2D).apply();

        worklabelNode.getComponent(Label).string = this.workNameArray[rd];
        worklabelNode.parent = find("Canvas/WorkLabelList");//设置父节点
        worklabelNode.setPosition(randomRange(-320, 320), 670);
    }

}


