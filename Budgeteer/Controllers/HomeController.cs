﻿using Budgeteer.DAL;
using Budgeteer.Models;
using Budgeteer.Utilities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Budgeteer.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        // GET: /Home/

        public ActionResult Index()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var userId = string.Empty;
            Claim userIdClaim = null;
            var viewModel = new HomepageViewModel();
            var DbContext = new BudgeteerDbContext();

            if (claimsIdentity != null)
            {
                // the principal identity is a claims identity.
                // now we need to find the NameIdentifier claim
                userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    userId = userIdClaim.Value;
                }
            }            
            viewModel.Entries = DbContext.Entries.Where(e => e.UserId.Equals(userId)).ToList();

            return View(viewModel);
        }

        public ActionResult Update

        [HttpPost]
        public JsonResult AddEntry(int type, int year, int month, int position, string name, int value, string username)
        {
            BudgeteerDbContext DbContext = new BudgeteerDbContext();
            var user = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username));
            var entry = new Entry { UserId = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username)).Id, Type = (EntryType)type, Year = year, Month = month, Position = position, Name = name, Value = value };
            DbContext.Entries.Add(entry);
            var result = DbContext.SaveChanges();
            return Json(result == 1 ? "success" : "failure");
        }

        [HttpPost]
        public JsonResult UpdateEntry(int type, int position, string name, int value, string username)
        {
            BudgeteerDbContext DbContext = new BudgeteerDbContext();
            var entryType = (EntryType)type;
            var userId = DbContext.Users.FirstOrDefault(u => u.UserName.Equals(username)).Id;
            
            var entry = new Entry { UserId = userId, Type = entryType, Year = 0, Month = 0, Position = position, Name = name, Value = value };

            var entryToUpdate = DbContext.Entries.First(e => e.Type == entryType && e.UserId == userId && e.Position == position);

            entry.EntryId = entryToUpdate.EntryId;
            entry.Year = entryToUpdate.Year;
            entry.Month = entryToUpdate.Month;

            DbContext.Entry(entryToUpdate).CurrentValues.SetValues(entry);

            var result = DbContext.SaveChanges();
            return Json(result == 1 ? "success" : "failure");
        }

        [HttpPost]
        public JsonResult DeleteEntry(int type, int position, string username)
        {
            BudgeteerDbContext DbContext = new BudgeteerDbContext();
            var userId = DbContext.Users.First(u => u.UserName == username).Id;
            var entryToDelete = DbContext.Entries.First(e => e.Type == (EntryType)type && e.Position == position && e.UserId == userId);

            DbContext.Entries.Remove(entryToDelete);
            
            var result = DbContext.SaveChanges();

            return Json(result == 1 ? "success" : "failure");
        }

        [Authorize]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
