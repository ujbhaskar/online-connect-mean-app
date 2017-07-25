import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emoji'
})
export class  EmojiPipe implements PipeTransform {

	transform(value: string): string {
		var text = value;
		var ar = text.split(' ');
		var emotionSymbols = [
			{
				to : ':)',
				with:'Slightly_Smiling_Face_Emoji_Icon_42x42.png'
			},
			{
				to : ':(',
				with:'Very_sad_emoji_icon_png_42x42.png'
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
				to : ':*',
				with:'Blow_Kiss_Emoji_42x42.png'
			},
			{
				to : '<y>',
				with:'like.jpg'
			},
			{
				to : ';)',
				with:'Wink_Emoji_42x42.png'
			},
			{
				to : '<3',
				with:'heart.png'
			},
			{
				to : ':|',
				with:'Expressionless_Face_Emoji_42x42.png'
			}
		];

		for(var i = 0;i<ar.length;i++){
			for(var j = 0; j<emotionSymbols.length;j++){
				if(ar[i] === emotionSymbols[j].to){
					ar[i] = '<span><img src="assets/emoji/'+emotionSymbols[j].with+'" class="emogi-image"></span>';
					break;
				}
			}
		}
	    return ar.join(' ');
	}
}