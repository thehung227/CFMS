import { Injectable, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver, ComponentRef, Inject } from '@angular/core';
import { GridCmp } from './components/GridCmp';
import { BarChartCmp } from './components/BarChartCmp';
import { RadialGaugeCmp } from './components/RadialGaugeCmp';
import { LinearGaugeCmp } from './components/LinearGaugeCmp';
import { ColumnChartCmp } from './components/ColumnChartCmp';
import { LineChartCmp } from './components/LineChartCmp';
import { BubbleChartCmp } from './components/BubbleChartCmp';
import { BulletGraphCmp } from './components/BulletGraphCmp';
import { BlankCmp } from './components/BlankCmp';
import { PieChartCmp } from './components/PieChartCmp';


@Injectable()
export class DynamicCompService {
    private componentFactoryResolver: ComponentFactoryResolver;

    constructor( @Inject(ComponentFactoryResolver) componentFactoryResolver: ComponentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }

    public createDynaComp(vCref: ViewContainerRef, tileType: string): ComponentRef<any> {
        let dynaCmp;
        if (tileType === 'Grid') {
            dynaCmp = GridCmp;
        } else if (tileType === "Bar Chart") {
            dynaCmp = BarChartCmp;
        } else if (tileType === "Radial Gauge") {
            dynaCmp = RadialGaugeCmp;
        } else if (tileType === "Linear Gauge") {
            dynaCmp = LinearGaugeCmp;
        } else if (tileType === "Column Chart") {
            dynaCmp = ColumnChartCmp;
        } else if (tileType === "Line Chart") {
            dynaCmp = LineChartCmp;
        } else if (tileType === "Bubble Chart") {
            dynaCmp = BubbleChartCmp;
        } else if (tileType === "Bullet Graph") {
            dynaCmp = BulletGraphCmp;
        } else if (tileType === "Pie Chart") {
            dynaCmp = PieChartCmp;
        } else if (tileType === "Blank") {
            dynaCmp = BlankCmp;
        }


        let factory = this.componentFactoryResolver.resolveComponentFactory(dynaCmp);
        // vCref is needed cause of that injector..
        let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);

        // create component without adding it directly to the DOM
        let comp = factory.create(injector);

        // add inputs first !! otherwise component/template crashes ..
        //comp.instance.model = modelInput;

        // all inputs set? add it to the DOM ..
        vCref.insert(comp.hostView);

        return comp;
    }

    public removeComp(vCref: ViewContainerRef, idx: number) {
        vCref.remove(idx);
    }

    public moveComp(vCref: ViewContainerRef, idx1: number, idx2: number) {
        var hostView = vCref.get(idx1);
        vCref.move(hostView, idx2);
    }
}