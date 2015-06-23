using Budgeteer.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace Budgeteer.DAL
{
    public class BudgeteerDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Entry> Entries { get; set; }

        public BudgeteerDbContext()
            : base("BudgeteerDbContext", throwIfV1Schema: false)
        {
        }

        public static BudgeteerDbContext Create()
        {
            return new BudgeteerDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<ApplicationUser>().ToTable("Users").Property(p => p.Id).HasColumnName("UserId");
            modelBuilder.Entity<ApplicationUser>().ToTable("Users").Property(p => p.UserName).HasColumnName("Username");

            modelBuilder.Entity<IdentityUserRole>().ToTable("UserRole").HasKey(p => new { p.RoleId, p.UserId });

            modelBuilder.Entity<IdentityUserLogin>().ToTable("UserLogin").HasKey(p => new { p.LoginProvider, p.ProviderKey, p.UserId });

            modelBuilder.Entity<IdentityUserClaim>().ToTable("UserClaim").HasKey(p => p.Id).Property(p => p.Id).HasColumnName("UserClaimId");

            modelBuilder.Entity<IdentityRole>().ToTable("Role").Property(p => p.Id).HasColumnName("RoleId");
        }
    }
}