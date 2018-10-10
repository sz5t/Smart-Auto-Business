
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import 'anychart';
import '../../../../assets/vender/anychart/zh-cn';
declare var anychart: any;
@Component({
  selector: 'app-pert-setting',
  templateUrl: './pert.component.html',
  styleUrls: ['./pert.css']
})
export class PertComponent implements OnInit, AfterViewInit {
  change = false;

  constructor(
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.getPertChart();

  }

  getPertChart() {
    const treeData = anychart.data.tree(this.getData(), 'as-table');
    // create pert
    const chart = anychart.pert();
    // set data
    chart.data(treeData)
      // set spacing between milestones
      .horizontalSpacing('10.75%')
      // set padding for chart
      .padding([25, 50, 0, 50]);

    // get duration project
    const duration = Math.ceil(chart.getStat('pertChartProjectDuration'));
    // get deviation project
    const deviation = Math.ceil(chart.getStat('pertChartCriticalPathStandardDeviation'));

    // set title text
    chart.title()
      .enabled(true)
      .useHtml(true)
      .padding([0, 0, 35, 0])
      .text(`电脑PC卡计划流程
        <br>项目周期:
        ${duration} &plusmn;
        ${deviation} 天
      `);

    chart.listen('click', function(e) {
      console.log('hello', e);
    });
    // set settings for tasks
    const tasks = chart.tasks();
    // format upper label tasks
    tasks.upperLabels().format(function () {
      return this.item.get('fullName');
    });
    // format lower label tasks
    tasks.lowerLabels().format(() => {
      // format time for tasks
      return this.timeTask(duration);
    });


    // create tasks tooltip
    const tasksTooltip = tasks.tooltip();
    // tooltip settings
    tasksTooltip.separator(true)
      .titleFormat(function () {
        // return fullName from data
        return this.item.get('fullName');
      });

    // set settings for critical tasks
    chart.criticalPath().tasks()
      .stroke('1 #D5A1DD')
      .color('#9E44B6');


    // set settings for milestones
    const milestones = chart.milestones();
    milestones.fill(function () {
      return this['creator'] ? '#9DACFF' : this['isStart'] ? '#a5b3b3' : '#60727b';
    });
    // hover fill/stroke color for milestones item
    milestones.hovered()
      .fill(function () {
        return this['creator'] ? anychart.color.lighten('#9DACFF', 0.25) : this['isStart'] ? '#60727b' : '#60727b';
      })
      .stroke(function () {
        return this['creator'] ? '1.5 #9DACFF' : null;
      });
    milestones.labels().format(function () {
      if (this['creator']) {
        const name = this.creator.get('name');
        return this['isStart'] ? (name) : (name);
      } else {
        return this['isStart'] ? '开始' : '结束';
      }
    });
    milestones.tooltip().format(this.defuaultMilesoneTooltipTextFormatter);

    // set settings for critical milestones
    const critMilestones = chart.criticalPath().milestones();
    // fill color for critMilestones item
    critMilestones.fill(function () {
      return this['creator'] ? '#A489D4' : this['isStart'] ? '#60727b' : '#60727b';
    });

    // hover fill/stroke color for critMilestones item
    critMilestones.hovered()
      .fill(function () {
        return this['creator'] ? anychart.color.lighten('#A489D4', 0.25) : this['isStart'] ? '#60727b' : '#60727b';
      })
      .stroke(function () {
        return this['creator'] ? '1.5 #A489D4' : null;
      });
    // format labels
    critMilestones.labels().format(function () {
      if (this['creator']) {
        const name = this.creator.get('name');
        return this['isStart'] ? (name) : (name);
      } else {
        return '>>';
      }
    });















    chart.container('container');
    chart.draw();
    // chart.fitAll();
  }

  timeTask(duration) {
    const days = Math.floor(duration);
    const hours = Math.ceil(24 * (duration - days));
    const daysPart = days !== 0 ? 'd:' + days + ' ' : '';
    const hoursPart = hours !== 0 ? 'h:' + hours + ' ' : '';
  
    return daysPart + hoursPart;
  }
  
  defuaultMilesoneTooltipTextFormatter() {
    let result = '';
    let i = 0;
    if (this['successors'] && this['successors'].length) {
      result += 'Successors:';
      for (i = 0; i < this['successors'].length; i++) {
        result += '\n - ' + this['successors'][i].get('fullName');
      }
      if (this['predecessors'] && this['predecessors'].length)
        result += '\n\n';
    }
    if (this['predecessors'] && this['predecessors'].length) {
      result += 'Predecessors:';
      for (i = 0; i < this['predecessors'].length; i++) {
        result += '\n - ' + this['predecessors'][i].get('fullName');
      }
    }
    return result;
  }

  // simple data
  getData() {
    return [
      {
        id: '1',
        optimistic: 20,
        pessimistic: 60,
        mostLikely: 35,
        name: '计划',
        fullName: '制定计划'
      },
      {
        id: '2',
        optimistic: 21,
        pessimistic: 42,
        mostLikely: 33,
        name: '流程 1',
        dependsOn: [
          '1'
        ],
        fullName: '硬件设计'
      },
      {
        id: '3',
        optimistic: 15,
        pessimistic: 25,
        mostLikely: 20,
        name: '流程 3',
        dependsOn: [
          '1'
        ],
        fullName: '布局管理'
      },
      {
        id: '4',
        optimistic: 30,
        pessimistic: 50,
        mostLikely: 43,
        name: '流程 4',
        dependsOn: [
          '2', '3'
        ],
        fullName: '软件设计'
      },
      {
        id: '5',
        optimistic: 10,
        pessimistic: 18,
        mostLikely: 12,
        name: '流程 5',
        dependsOn: [
          '2'
        ],
        fullName: '电路板'
      },
      {
        id: '6',
        optimistic: 17,
        pessimistic: 28,
        mostLikely: 23,
        name: '流程 6',
        dependsOn: [
          '3'
        ],
        fullName: '完成管理'
      },
      {
        id: '7',
        optimistic: 17,
        pessimistic: 35,
        mostLikely: 27,
        name: '流程 7',
        dependsOn: [
          '5'
        ],
        fullName: '硬件测试'
      },
      {
        id: '8',
        optimistic: 10,
        pessimistic: 21,
        mostLikely: 16,
        name: '流程 8',
        dependsOn: [
          '4',
          '7'
        ],
        fullName: '硬件发布'
      },
      {
        id: '9',
        optimistic: 25,
        pessimistic: 43,
        mostLikely: 31,
        name: '流程 9',
        dependsOn: [
          '4'
        ],
        fullName: '完成软件开发'
      },
      {
        id: '10',
        optimistic: 7,
        pessimistic: 11,
        mostLikely: 9,
        name: '流程 10',
        dependsOn: [
          '6'
        ],
        fullName: '发布管理'
      },
      {
        id: '11',
        optimistic: 19,
        pessimistic: 31,
        mostLikely: 25,
        name: '流程 11',
        dependsOn: [
          '8'
        ],
        fullName: '硬件制造'
      },
      {
        id: '12',
        optimistic: 5,
        pessimistic: 12,
        mostLikely: 7,
        name: '流程 12',
        dependsOn: [
          '9'
        ],
        fullName: '软件发布'
      },
      {
        id: '13',
        optimistic: 12,
        pessimistic: 20,
        mostLikely: 15,
        name: '流程 13',
        dependsOn: [
          '10'
        ],
        fullName: '打印管理'
      }
    ];
  }
}

// anychart-credits-text
