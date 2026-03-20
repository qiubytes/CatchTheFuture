import { _decorator, Component, EventTouch, instantiate, Node, Prefab, tween, UITransform, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Basket')
export class Basket extends Component {
    private offset: Vec3 = new Vec3();
    private _isDragging: boolean = false;
    @property(Vec2)
    maxBoundary: Vec2 = new Vec2();
    @property(Vec2)
    minBoundary: Vec2 = new Vec2();
    @property(Prefab)
    futureWorkLabel: Prefab = null;
    onTouchMove(event: EventTouch) {
        if (!this._isDragging) return;

        // let touchLocation = event.getUILocation();
        // //减去偏移量 不让他立即跑到手指位置
        // let newPosition = new Vec3(touchLocation.x - this.offset.x, touchLocation.y - this.offset.y, 0);
        // this.node.setPosition(newPosition);
        const parent = this.node.parent;
        const uiTransform = parent.getComponent(UITransform);
        let worldTouch = event.getLocation();
        let touchInParent = uiTransform.convertToNodeSpaceAR((new Vec3(worldTouch.x, worldTouch.y, 0)));
        let newPos = new Vec3(touchInParent.x - this.offset.x, touchInParent.y - this.offset.y, 0);
        newPos = this.clampPosition(newPos);
        this.node.setPosition(newPos);
    }
    onTouchStart(event: EventTouch) {
        // let touchLocation = event.getUILocation();//手指触摸的位置
        // let nodeLocation = this.node.getPosition();//当前节点的位置
        // //计算位置偏移量
        // this.offset.set(touchLocation.x - nodeLocation.x, touchLocation.y - nodeLocation.y, 0);
        const parent = this.node.parent;
        const uiTransform = parent.getComponent(UITransform);
        let worldTouch = event.getLocation();
        let touchInParent = uiTransform.convertToNodeSpaceAR(new Vec3(worldTouch.x, worldTouch.y, 0));
        let nodePos = this.node.position;
        this.offset.set(touchInParent.x - nodePos.x, touchInParent.y - nodePos.y, 0);
        console.log(this.offset);
        this._isDragging = true;
    }
    onTouchEnd(event: EventTouch) {
        this._isDragging = false;
    }
    clampPosition(position: Vec3): Vec3 {
        // console.log("原始pos");
        // console.log(position);
        //限制X 和 Y 不拖出屏幕
        let clampedX = Math.max(this.minBoundary.x, Math.min(position.x, this.maxBoundary.x));//相当于三元运算
        let clampedY = Math.max(this.minBoundary.y, Math.min(position.y, this.maxBoundary.y));
        let clampedVec3 = new Vec3(clampedX, clampedY, 0);
        // console.log(clampedVec3);
        return clampedVec3;
    }
    addTouch() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchMove, this);

    }
    removeTouch() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchMove, this);
    }
    protected onLoad(): void {
        this.addTouch();
    }
    protected onDestroy(): void {
        this.removeTouch();
    }
    start() {
        this.scheduleOnce(() => {
            this.removeTouch();
            let FutureWorkLabel = instantiate(this.futureWorkLabel);
            FutureWorkLabel.setParent(this.node);
            let t1 = tween(FutureWorkLabel).to(1.5, { position: new Vec3(0, 100, 0) }, { easing: "backInOut" });
            // t1.start();
            let t2 = tween(this.node).to(2, { position: new Vec3(0, 160, 0) });
            t1.call(() => {
                t2.start()
            }).start();
        }, GameManager.instance.totalTime);
    }

    update(deltaTime: number) {

    }
}


