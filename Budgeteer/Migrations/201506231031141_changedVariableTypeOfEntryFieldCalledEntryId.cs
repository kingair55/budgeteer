namespace Budgeteer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changedVariableTypeOfEntryFieldCalledEntryId : DbMigration
    {
        public override void Up()
        {
            //DropPrimaryKey("dbo.Entry");
            //AlterColumn("dbo.Entry", "EntryId", c => c.Guid(nullable: false, identity: true));
            //AddPrimaryKey("dbo.Entry", "EntryId");
        }
        
        public override void Down()
        {
            //DropPrimaryKey("dbo.Entry");
            //AlterColumn("dbo.Entry", "EntryId", c => c.String(nullable: false, maxLength: 128));
            //AddPrimaryKey("dbo.Entry", "EntryId");
        }
    }
}
