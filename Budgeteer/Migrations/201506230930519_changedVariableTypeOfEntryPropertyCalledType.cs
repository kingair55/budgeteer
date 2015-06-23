namespace Budgeteer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changedVariableTypeOfEntryPropertyCalledType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Entry", "Type", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Entry", "Type", c => c.String());
        }
    }
}
