namespace Budgeteer.Migrations
{
    using Budgeteer.Models;
    using Budgeteer.DAL;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Configuration;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Budgeteer.Utilities.Enums;
    using System.Collections.Generic;

    internal sealed class Configuration : DbMigrationsConfiguration<BudgeteerDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(BudgeteerDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            //  This method will be called after migrating to the latest version.

            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new BudgeteerDbContext()));

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new BudgeteerDbContext()));

            var user = new ApplicationUser()
            {
                UserName = ConfigurationManager.AppSettings["seedDataAdminUsername"],
                Email = ConfigurationManager.AppSettings["seedDataAdminEmail"],
                EmailConfirmed = true
            };

            userManager.Create(user, ConfigurationManager.AppSettings["seedDataAdminPassword"]);

            if (roleManager.Roles.Count() == 0)
            {
                roleManager.Create(new IdentityRole { Name = "Admin" });
                roleManager.Create(new IdentityRole { Name = "User" });
            }

            var adminUser = userManager.FindByName(ConfigurationManager.AppSettings["seedDataAdminUsername"]);

            userManager.AddToRole(adminUser.Id, "Admin");

            var entries = new List<Entry>{
                new Entry { UserId = adminUser.Id, Type = EntryType.Income, Year = 2015, Month = 6, Position = 0,  Name = "Salary", Value = 3000 },
                new Entry { UserId = adminUser.Id, Type = EntryType.Expense, Year = 2015, Month = 6, Position = 0,  Name = "Rent", Value = 1000 }
            };

            entries.ForEach(e => context.Entries.AddOrUpdate(e));
            context.SaveChanges();
        }
    }
}