namespace Budgeteer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addEntryTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Entry",
                c => new
                    {
                        EntryId = c.String(nullable: false, maxLength: 128),
                        Type = c.String(),
                        Year = c.Int(nullable: false),
                        Month = c.Int(nullable: false),
                        Position = c.Int(nullable: false),
                        Name = c.String(),
                        Value = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EntryId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Entry");
        }
    }
}
