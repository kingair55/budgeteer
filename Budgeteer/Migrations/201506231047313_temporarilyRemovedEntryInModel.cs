namespace Budgeteer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class temporarilyRemovedEntryInModel : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.Entry");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Entry",
                c => new
                    {
                        EntryId = c.Guid(nullable: false, identity: true),
                        Type = c.Int(nullable: false),
                        Year = c.Int(nullable: false),
                        Month = c.Int(nullable: false),
                        Position = c.Int(nullable: false),
                        Name = c.String(),
                        Value = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EntryId);
            
        }
    }
}
