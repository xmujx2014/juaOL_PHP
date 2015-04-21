var PersonModel = Backbone.Model

var AddPersonView = Backbone.View.extend({
	events:{
		"click div.add_person img[name=img_url]": "chooseImg",
		// "change div.add_person input[type=file]": "showImg",
	},
	render: function(){
		$(this.el).html($.tpl['add_person']())
		//图片即时显示===找了好久
		$("div.add_person input[type=file]").change(function(){
			var file = this.files[0];
			var reader = new FileReader();
			reader.onload = function(){
				$("div.add_person img[name=img_url]").attr('src', reader.result)
			};
			reader.readAsDataURL(file);
		})
	},
	chooseImg: function(){
		$("div.add_person input[type=file]").click()
	},
	showPersonInfo: function(id){
		$addPerson = $("div.add_person")
		$.ajax({
			url: '/juaOL/index.php/User/getInfo',
			type: "post",
			data: {id: id},
			success: function(data){
				if(data['code'] == 200){
					for(var num in personInfo){
						tmp = personInfo[num]
						$addPerson.find("input[name=" + tmp + "]").val(data['person'][tmp])
					}
					$("select[name=groupe] option").each(function(){
						// d($(this).val())
						if($(this).val() == data['person']['groupe'])
							$(this).attr("selected", "")
					})
					$("select[name=gender] option").each(function(){
						// d($(this).val())
						if($(this).val() == data['person']['gender'])
							$(this).attr("selected", "")
					})
					$("select[name=category] option").each(function(){
						// d($(this).val())
						if($(this).val() == data['person']['category'])
							$(this).attr("selected", "")
					})
					$("div.add_person img[name=img_url]").attr('src', data['person']['img_url']);
					$addPerson.find("input[name=id]").val(id)
				}
			}
		}, "json")
	},
	showImg: function(){
		$("div.add_person img[name=img_url]").attr('alt', 'You already choose an image, submit to show it.')
		$("div.add_person img[name=img_url]").addClass('success')
	}
});
var UserInfo = Backbone.View.extend({
	render: function(){
		$(this.el).html($.tpl['person_info']())
		$(".person_info table a.edit").click(function(){
			$tr = $(this).parent().parent()
			var id = $tr.attr("data-id")

			location.hash = '#addPerson/' + id
		});
	},
});

var AppRouter = Backbone.Router.extend({
	routes:{
		"": "userInfo",
		"addPerson": "addPerson",
		"addPerson/:id": "addPerson"
	},
	userInfo: function(){
		var userInfoView = new UserInfo({
			el: $("div.main")
		})
		userInfoView.render()
	},
	addPerson: function(id){
		var addPersonView = new AddPersonView({
			el: $("div.main")
		})
		addPersonView.render()
		addPersonView.showPersonInfo(id)
	}
});


(function($){
	$(document).ready(function(){
		personInfo = new Array('family_name','given_name',
			'simple_name','identity_num','best_result','number_of_officials',
			'number_of_competitiors','federation','passport_no',
			'tel','email','adress')

		app = new AppRouter()
		Backbone.history.start()		
	})
})(jQuery);