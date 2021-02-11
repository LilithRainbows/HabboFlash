declare module "native-prompt" {
    /**
     * @description Create native prompts with Node.js and Electron
     * @param { string } title The title you want to display at the top of the window
     * @param { string } body Any helpful text to go inside the message box
     * @param { Object } options 
        Extra options to go with the prompt. Can be:
            defaultText:string - The text you want to already be in the input box beforehand
            mask:boolean - Whether you want the box to have a hidden input
    
    * @requires title
    * @requires body
    * @author ssight 
    */
    function prompt(title: string, body: string, options?: { defaultText?: string, mask?: boolean }): Promise<string | null>
    export = prompt;
}