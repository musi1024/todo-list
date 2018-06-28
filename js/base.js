var myTodoModule =(function() {
		// 变量
		var task_list = []
		var done_list = []
		var $task_list, $done_list, $add_content, $button_add_todo,
				$button_done_list, $button_task_list,
				$task_detail, $task_content, $delete
		var detailIndex,deteleIndex,checkIndex//定义点击详情和删除的时候记录的索引index

		// 初始化jquery对象
		var initJqVar = function() {
				$task_list = $('.task-list')
				$done_list = $('.done-list')
				$add_content = $('.add-content')
				$button_add_todo = $('.button-add-todo')
				$button_task_list = $('.button-task-list')
				$button_done_list = $('.button-done-list')
				$task_detail = $('.task-detail')
				$task_content= $('.detail-content')
				$delete = $('.delete')
		}

		// 页面初始化的时候，从store中取出item，并渲染
		var initRenderIndex = function() {
				$task_list.html('')
				// task_list = store.get('task_list')
				if (task_list.length == undefined) {
						store.set('task_list', task_list)
				}
				var taskHtmlStr = ''
				for(var i = task_list.length - 1; i >= 0; i--) {
						if (task_list[i].content == undefined) {
								task_list[i].content = ''
						}
						if (task_list[i].datetime == undefined) {
								task_list[i].datetime = ''
						}
						if (task_list[i].level == undefined) {
								task_list[i].level = ''
						}
						var oneItem = `
								<div class="task-item" >
										<div class='task-item-title' style="color:${task_list[i].color}">
												<input class='check' type="checkbox" />
												<span class="item-title">${task_list[i].title}</span>
												<span class="item-level">${task_list[i].level}</span>
												<span class="fr">
														<span class='item-datetime'>${task_list[i].datetime}</span>
														<span class="action delete">delete</span>
												</span>
										</div>
										<div class="task-detail">
												<span>Title<input type="text" class="detail-title" value='${task_list[i].title}' /></span><br/>
												<span>
														<span class="ps">Content</span>
														<textarea class="detail-content" >${task_list[i].content}</textarea>
												</span><br/>
												<span>Date<input type="text" class="detail-datetime" value='${task_list[i].datetime}' /></span><br/>
												<span>Level</span>
												<span class='detail-level'>
														<input type="button" class='level0 button-level' value=" " >
														<input type="button" class='level1 button-level' name='green' value="!" style='background-color: green'>
														<input type="button" class='level2 button-level' value="!!" style='background-color: #ffb300'>
														<input type="button" class='level3 button-level' value="!!!" style='background-color: red'>
												</span><br/>
												<button type="button" class='button-detail-update'>save</button>
										</div>
								</div>
							`
						taskHtmlStr = taskHtmlStr + oneItem
				}
				$(taskHtmlStr).appendTo($task_list)
				listenDetail()//注册click事件
				listenDelete()//删除的
				listenCheck()
				listenDetailSave()
				listenLevel()
				$('.detail-datetime').datetimepicker()
		}

		// 渲染 done list
		var renderDoneList = function() {
				$task_list.html('')
				// done_list = store.get('done_list')
				if (done_list.length == undefined) {
						store.set('done_list', done_list)
				}
				var doneHtmlStr = ''
				for(var i = done_list.length-1 ; i >= 0; i--) {
						var doneItem = `
								<div class="task-item ischeck">
										<div class='task-item-title' >
												<input class='check' checked='checked' type="checkbox" />
												<span class="item-title">${done_list[i].title}</span>
												<span class="item-level">${done_list[i].level}</span>
												<span class="fr">
														<span>${done_list[i].datetime}</span>
														<span class="action delete">delete</span>
												</span>
										</div>
										<div class="task-detail">
												<span>Title<input type="text" class="detail-title" value='${done_list[i].title}' readonly /></span><br/>
												<span class="ps">Content</span>
												<textarea class="detail-content" readonly >${done_list[i].content}</textarea><br/>
												<span>Date<input type="text" class="detail-datetime" value='${done_list[i].datetime}' readonly /></span><br/>
										</div>
								</div>
							`
						doneHtmlStr = doneHtmlStr + doneItem
				}
				$(doneHtmlStr).appendTo($task_list)
				listenDetail()//注册click事件
				listenDelete()//删除的
				listenCheck()
		}

		// 添加taskItem操作方法
		var addTask = function() {
				var new_task = {}
				new_task.title = $add_content.val();//获取输入框内容
				task_list.push(new_task)//更新数组操作
				store.set('task_list',task_list)
				initRenderIndex()
				$add_content.val('')

		}

		// 监听 list 切换
		var listenChangeList = function() {
				$button_done_list.on('click', function() {
						renderDoneList()
						$(this).addClass('here')
						$button_task_list.removeClass('here')
				})
				$button_task_list.on('click', function() {
						initRenderIndex()
						$(this).addClass('here')
						$button_done_list.removeClass('here')
				})
		}

		// 添加任务按钮监听事件
		var listenAddTaskItem = function() {
				$button_add_todo.click(function(){
						if ($add_content.val() != '') {
								addTask()
								$button_done_list.removeClass('here')
								$button_task_list.addClass('here')
						}	else {
								alert("Here can't be empty!")
						}
				})
				$('.add-content').keyup(function(event) {
				    var keycode = (event.keyCode ? event.keyCode : event.which)
				    if (keycode == '13' && $add_content.val() != '') {
				        addTask()
								$button_done_list.removeClass('here')
								$button_task_list.addClass('here')
				    }	else if (keycode == '13' && $add_content.val() == '') {
								alert("Here can't be empty!")
						}
				})
		}

		// 点击任务item查看编辑详情内容
		var listenDetail = function() {
				$('.task-item-title').click(function(){
						$(this).parent().find($('.task-detail')).slideToggle()
				})
		}

		// 点击保存按钮保存详细内容
		var listenDetailSave = function() {
				$('.button-detail-update').on('click', function() {
						detailIndex = task_list.length - 1 - $(this).parent().parent().index()
						var dataTask = {}
						dataTask.title = $(this).parent().find($('.detail-title')).val()
						dataTask.content = $(this).parent().find($('.detail-content')).val()
						dataTask.datetime = $(this).parent().find($('.detail-datetime')).val()
						dataTask.level = $(this).parent().find($('.level')).val()
						dataTask.color = ''
						if (dataTask.level == '!') {
								dataTask.color = 'green'
						}	else if (dataTask.level == '!!') {
								dataTask.color = '#ffb300'
						}	else if (dataTask.level == '!!!') {
								dataTask.color = 'red'
						}	else {
							dataTask.color = ''
						}
						task_list[detailIndex] = $.extend(task_list[detailIndex],dataTask)
						store.set('task_list',task_list)
						console.log(dataTask.level);
						$(this).parent().parent().find($('.item-title')).html(dataTask.title)
						$(this).parent().parent().find($('.item-datetime')).html(dataTask.datetime)
						$(this).parent().parent().find($('.item-level')).html(dataTask.level)
						$(this).parent().parent().find($('.task-item-title')).css({'color':dataTask.color})
						$(this).parent().slideToggle('slow')
				})
		}

		// 选择 item level
		var listenLevel = function() {
				$('.detail-level').on('click', 'input', function() {
						$(this).parent().find('input').removeClass('level')
						$(this).addClass('level')
				})
		}

		// 点击check
		var listenCheck = function() {
				$('.check').on('click', function() {
						console.log('test');
						if ($(this).parent().parent().hasClass('ischeck')) {
								var todo_item = {}
								checkIndex = done_list.length - 1 - $(this).parent().parent().index()
								console.log(checkIndex, done_list);
								todo_item.title = done_list[checkIndex].title
								todo_item.level = done_list[checkIndex].level
								todo_item.color = done_list[checkIndex].color
								todo_item.content = done_list[checkIndex].content
								todo_item.datetime = done_list[checkIndex].datetime
								task_list.push(todo_item)
								store.set('task_list', task_list)
								done_list.splice(checkIndex,1)//第一个是索引，第二个是个数
								$(this).parent().parent().remove()
								store.set('done_list', done_list)
						} else {
								var done_item = {}
								checkIndex =  task_list.length - 1 - $(this).parent().parent().index()
								console.log(checkIndex, task_list);
								done_item.title = task_list[checkIndex].title
								done_item.level = task_list[checkIndex].level
								done_item.color = task_list[checkIndex].color
								done_item.content = task_list[checkIndex].content
								done_item.datetime = task_list[checkIndex].datetime
								done_list.push(done_item)
								console.log(done_list);
								store.set('done_list', done_list)
								task_list.splice(checkIndex,1)//第一个是索引，第二个是个数
								$(this).parent().parent().remove()
								store.set('task_list', task_list)
						}
				})
		}

		// 删除操作
		var listenDelete = function(){
				$('.delete').click(function(){
				if ($(this).parent().parent().parent().hasClass('ischeck')) {
						deteleIndex = done_list.length - 1 - $(this).parent().parent().parent().index()
						var r =  confirm('Are you sure to remove the Todo?')
						if(r){
								done_list.splice(deteleIndex,1)//第一个是索引，第二个是个数
								$(this).parent().parent().parent().remove()
								console.log(done_list);
								store.set('done_list', done_list)
						}
				} else {
						deteleIndex = task_list.length - 1 - $(this).parent().parent().parent().index()
						var r =  confirm('Are you sure to remove the Todo?')
						if(r){
								task_list.splice(deteleIndex,1)//第一个是索引，第二个是个数
								$(this).parent().parent().parent().remove()
								store.set('task_list', task_list)
						}
				}
				})
		}

		// 页面初始化就要执行的方法放在initmodule里边
		var initModule = function(){
				// store.clear()
				task_list = store.get('task_list')
				done_list = store.get('done_list')
				if (task_list == undefined && task_list == undefined) {
						task_list = []
						done_list = []
						store.set('task_list', task_list)
						store.set('done_list', done_list)
						console.log(task_list)
						initJqVar()
						initRenderIndex()
						listenAddTaskItem()
						listenChangeList()
				} else {
						initJqVar()
						initRenderIndex()
						listenAddTaskItem()//添加任务列表监听事件
						listenChangeList()
				}
		}
		return {
			initModule:initModule
		}
})()

$(function(){
	myTodoModule.initModule()
})
