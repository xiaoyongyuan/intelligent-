export default {
  menus: [
    //企业用户
    {
      key: "/app/overView/index",
      identi: ["comptop"],
      title: "大数据",
      icon: "line-chart",
      funct: "basic",
      component: "Overview"
    },
    // { key: '/app/companyhome/visual', identi:['comptop'], title: '首页', icon: 'home', funct:'basic', component: 'Datavisual' },
    {
      key: "/app/companyhome/index",
      identi: ["comp", "comptop"],
      title: "总览",
      icon: "home",
      funct: "basic",
      component: "Companyhome"
    },
    //个人用户总览
    {
      key: "/app/Userhome/index",
      identi: ["user"],
      title: "总览",
      icon: "home",
      funct: "basic",
      component: "Userhome"
    },
    //设备
    {
      key: "/app/Userhome/Equipment",
      identi: ["comp", "comptop", "user"],
      title: "设备",
      icon: "video-camera",
      funct: "basic",
      component: "Equipment"
    },
    //报警
    {
      key: "/app/Userhome/Alarmlist",
      identi: ["comp", "comptop", "user"],
      title: "报警",
      dot: "true",
      icon: "alert",
      funct: "basic",
      component: "Alarmlist"
    },
    {
      key: "/app/patrol",
      title: "巡更",
      identi: ["comp", "comptop", "patrol"],
      funct: "patrol",
      icon: "environment",
      subs: [
        {
          key: "/app/patrol/patrolhistory",
          identi: ["comp", "comptop", "patrol"],
          funct: "patrol",
          title: "巡更记录",
          component: "PatrollHostory"
        },
        {
          key: "/app/patrol/patrolrecord",
          identi: ["comp", "comptop", "patrol"],
          funct: "patrol",
          title: "巡更历史",
          component: "PatrolRecord"
        },
        {
          key: "/app/patrol/patrolplan",
          identi: ["comp", "comptop", "patrol"],
          funct: "patrol",
          title: "巡更计划",
          component: "PatrolPlan"
        }
      ]
    },
    {
      key: "/app/rollcall",
      title: "点名",
      identi: ["comp", "comptop", "rollcall"],
      funct: "rollcall",
      icon: "scan",
      subs: [
        {
          key: "/app/rollcall/rollcallhistory",
          identi: ["comp", "comptop", "rollcall"],
          funct: "rollcall",
          title: "点名记录",
          component: "RollcallHostory"
        },
        {
          key: "/app/rollcall/rollcallrecord",
          identi: ["comp", "comptop", "rollcall"],
          funct: "rollcall",
          title: "点名历史",
          component: "RollcallRecord"
        },
        {
          key: "/app/rollcall/rollcalltask",
          identi: ["comp", "comptop", "rollcall"],
          funct: "rollcall",
          title: "点名任务",
          component: "RollcallTask"
        }
      ]
    },
    //系统管理
    {
      key: "/app/settings",
      title: "系统管理",
      identi: ["comp", "comptop", "user"],
      icon: "bars",
      funct: "basic",
      subs: [
        {
          key: "/app/settings/employeelist",
          identi: ["comp", "comptop", "user"],
          title: "用户管理",
          funct: "basic",
          component: "Employeelist"
        },
       /* {
          key: "/app/settings/objShow",
          identi: ["comp", "comptop", "user"],
          title: "报警对象展示",
          funct: "basic",
          component: "objShow"
        },*/
        {
          key: "/app/settings/messages",
          identi: ["comp", "comptop", "user"],
          title: "消息查看",
          funct: "basic",
          component: "Messages"
        }

        // { key: '/app/settings/loglist', identi:['comp','comptop','user'], title: '日志', funct:'basic', component: 'Loglist'},
      ]
    }
  ],
  // 非菜单相关路由
  others: [
    {
      key: "/app/companyhome/companyscene",
      title: "场景",
      component: "Companyscene"
    },
    {
      key: "/app/companyhome/deveicedet",
      title: "设备详情",
      component: "Deveicedet"
    },
    {
      key: "/app/companyhome/companydeveice",
      title: "设备总览",
      component: "Companydeveice"
    },
    {
      key: "/app/companyhome/setarea",
      title: "设置防区",
      component: "Setarea"
    },
    {
      key: "/app/companyhome/settime",
      title: "设置布防时间",
      component: "Settime"
    },
    { key: "/app/companyhome/calling", title: "点名", component: "Calling" },
    { key: "/app/rollcall/adopt", title: "设置点名", component: "Adopt" },
    { key: "/app/rollcall/auditing", title: "设置点名", component: "Auditing" },
    { key: "/app/companyhome/connent", title: "关系网", component: "Connent" },
    {
      key: "/app/userhome/Alarmdetails",
      title: "报警详情",
      component: "Alarmdetails"
    },
    {
      key: "/app/rollcall/adoptlook",
      title: "点名对象详情",
      component: "AdoptLook"
    },
    {
      key: "/app/userhome/Userdeveice",
      title: "设备详情",
      component: "Userdeveice"
    },
    {
        key: "/app/live/index",
        identi: ["comp", "comptop", "user"],
        title: "直播",
        icon: "camera",
        funct: "basic",
        component: "Live"
    },
    {
      key: "/subs4",
      title: "页面",
      icon: "switcher",
      subs: [{ key: "/login", title: "登录" }, { key: "/404", title: "404" }]
    }
  ]
};
