namespace Budgeteer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addedUserIdFieldInEntryModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Entry", "UserId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Entry", "UserId");
        }
    }
}
