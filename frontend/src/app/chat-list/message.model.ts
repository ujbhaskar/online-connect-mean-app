export class Message {
    constructor(
    	public message: string,
    	public sender: string,
    	public receiver: [string],
    	public type: string,
    	public date: Date,
    	public seen:Boolean
    	) {}
}