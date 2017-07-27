import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emoji'
})
export class  EmojiPipe implements PipeTransform {
	getEmoji(){
		return [
			{
				to : ':)',
				with:'Slightly_Smiling_Face_Emoji_Icon_42x42.png'
			},
			{
				to : ';)',
				with:'Wink_Emoji_42x42.png'
			},
			{
				to : ':(',
				with:'Very_sad_emoji_icon_png_42x42.png'
			},
			{
				to : ':worry:',
				with:'Worried_Face_Emoji_42x42.png'
			},
			{
				to : ':D',
				with:'Smiling_Face_Emoji_Icon_42x42.png'
			},
			{
				to : ':P',
				with:'Tongue_Out_Emoji_Icon_42x42.png'
			},
			{
				to : '><p',
				with:'Tongue_Out_Emoji_with_Tightly_Closed_Eyes_Icon_42x42.png'
			},
			{
				to : ';P',
				with:'Tongue_Out_Emoji_with_Winking_Eye_Icon_42x42.png'
			},
			{
				to : ':*',
				with:'Blow_Kiss_Emoji_42x42.png'
			},
			{
				to : '<y>',
				with:'like.jpg'
			},
			{
				to : '<3',
				with:'heart.png'
			},
			{
				to : ':|',
				with:'Expressionless_Face_Emoji_42x42.png'
			},
			{
				to : ':angry:',
				with:'angry.png'
			},
			{
				to : ':>(:',
				with:'Angry_Emoji_42x42.png'
			},
			{
				to : ':anguish:',
				with:'Anguished_Face_Emoji_42x42.png'
			},
			{
				to : ':astonish:',
				with:'Astonished_Face_Emoji_42x42.png'
			},
			{
				to: ':coldSweat:',
				with: 'Cold_Sweat_Emoji_42x42.png'
			},
			{
				to: ':Confounded:',
				with: 'Confounded_Face_Emoji_42x42.png'
			},
			{
				to: ':Confused:',
				with: 'Confused_Face_Emoji_42x42.png'
			},
			{
				to: ':cry:',
				with: 'cry.png'
			},
			{
				to: ':crying:',
				with: 'Crying_Face_Emoji_42x42.png'
			},
			{
				to: ':disappoint:',
				with: 'Disappointed_but_Relieved_Face_Emoji_42x42.png'
			},
			{
				to: ':disappointed:',
				with: 'Disappointed_Face_Emoji_42x42.png'
			},
			{
				to: ':dizzy:',
				with: 'Dizzy_Face_Emoji_42x42.png'
			},
			{
				to: ':fwm:',
				with: 'Emoji_Face_without_Mouth_42x42.png'
			},
			{
				to: ':fwcse:',
				with: 'Face_with_Cold_Sweat_Emoji_42x42.png'
			},
			{
				to: ':fwree:',
				with: 'Face_With_Rolling_Eyes_Emoji_42x42.png'
			},
			{
				to: ':flush:',
				with: 'Flushed_Face_Emoji_42x42.png'
			},
			{
				to: ':grin:',
				with: 'Grinmacing_Face_Emoji_42x42.png'
			},
			{
				to: ':hearteyes:',
				with: 'Heart_Eyes_Emoji_42x42.png'
			},
			{
				to: ':hugg:',
				with: 'Hugging_Face_Emoji_42x42.png'
			},
			{
				to: ':omg:',
				with: 'OMG_Face_Emoji_42x42.png'
			},
			{
				to: ':sick:',
				with: 'Sick_Emoji_42x42.png'
			},
			{
				to: ':sleep:',
				with: 'Sleeping_Emoji_42x42.png'
			},
			{
				to: ':think:',
				with: 'Thinking_Face_Emoji_42x42.png'
			},
			{
				to: ':tired:',
				with: 'Tired_Face_Emoji_42x42.png'
			}

		];
	}
	addhttp(url) {
	   if (/^(f|ht)tps?:\/\//i.test(url)) {
	      url = '<a target="_blank" href="'+url+'" >'+url+'</a>';
	   }
	   return url;
	}
	transform(value: string): string {
		var text = value;
		if(text){

			var ar = text.split(' ');
			var emotionSymbols = this.getEmoji();

			for(var i = 0;i<ar.length;i++){
				for(var j = 0; j<emotionSymbols.length;j++){
					if(ar[i] === emotionSymbols[j].to){
						ar[i] = '<span><img src="assets/emoji/'+emotionSymbols[j].with+'" class="emogi-image"></span>';
					}
					else{
						ar[i] = this.addhttp(ar[i]);
					}
				}
			}
		    return ar.join(' ');	
		}
	}

}