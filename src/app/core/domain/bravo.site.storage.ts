export class BravoSiteStorage{
    constructor(user_id: number, user_name: string, branch_code: string, lang_id: number){
        this.UserId = user_id;
        this.UserName = user_name;
        this.BranchCode = branch_code;
        this.LangId = lang_id;
    }

    public UserId: number;
    public UserName: string;
    public BranchCode: string;
    public LangId: number;
}