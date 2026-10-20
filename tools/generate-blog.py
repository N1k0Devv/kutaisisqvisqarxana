#!/usr/bin/env python3
"""Generate Georgian granite SEO blog posts for qutstone.com"""
from __future__ import annotations

import json
from pathlib import Path
from datetime import date, timedelta

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
SITE = "https://www.qutstone.com"

# 50 unique articles: slug, title, description, keyword focus, sections (h2, paragraphs)
ARTICLES = [
  {
    "slug": "granitis-filebi-sakartvelo",
    "title": "გრანიტის ფილები საქართველოში — სრული გზამკვლევი",
    "desc": "როგორ ავირჩიოთ გრანიტის ფილები საქართველოში: ტიპები, ზომები, ფასი და სად ვიყიდოთ ხარისხიანი გრანიტის ფილა ქუთაისიდან.",
    "keyword": "გრანიტის ფილები",
    "date": "2025-01-10",
  },
  {
    "slug": "granitis-fila-raaris",
    "title": "გრანიტის ფილა — რა არის და რაში გამოიყენება",
    "desc": "გრანიტის ფილა არის ნატურალური ქვის პროდუქტი იატაკის, კედლისა და გარე სივრცეებისთვის. გაიგეთ უპირატესობები და გამოყენება.",
    "keyword": "გრანიტის ფილა",
    "date": "2025-01-12",
  },
  {
    "slug": "granitis-bloki",
    "title": "გრანიტის ბლოკი — დამუშავება და გამოყენება",
    "desc": "გრანიტის ბლოკის დამუშავება ქუთაისში: მასიური დეტალები, არქიტექტურული ელემენტები და სამშენებლო პროექტები.",
    "keyword": "გრანიტის ბლოკი",
    "date": "2025-01-14",
  },
  {
    "slug": "granitis-kibe",
    "title": "გრანიტის კიბე — გამძლე და ელეგანტური არჩევანი",
    "desc": "გრანიტის კიბე შიდა და გარე სივრცეებისთვის. როგორ ავირჩიოთ გრანიტის საფეხურები და რა უნდა ვიცოდეთ მონტაჟამდე.",
    "keyword": "გრანიტის კიბე",
    "date": "2025-01-16",
  },
  {
    "slug": "granitis-safechurebi",
    "title": "გრანიტის საფეხურები — ზომები, ხარისხი და მონტაჟი",
    "desc": "გრანიტის საფეხურების დამზადება ინდივიდუალური ზომებით. რჩევები არჩევანზე, უსაფრთხოებასა და მოვლაზე.",
    "keyword": "გრანიტის საფეხურები",
    "date": "2025-01-18",
  },
  {
    "slug": "granitis-damushaveba",
    "title": "გრანიტის დამუშავება — როგორ მუშაობს ქარხანა",
    "desc": "გრანიტის დამუშავების პროცესი: ჭრა, პოლირება, კიდეების დამუშავება და ხარისხის კონტროლი ქუთაისის ქვის ქარხანაში.",
    "keyword": "გრანიტის დამუშავება",
    "date": "2025-01-20",
  },
  {
    "slug": "naturaluri-graniti",
    "title": "ნატურალური გრანიტი — რატომ არის საუკეთესო არჩევანი",
    "desc": "ნატურალური გრანიტის უპირატესობები ხელოვნურ მასალებთან შედარებით: გამძლეობა, სილამაზე და ხანგრძლივი მომსახურება.",
    "keyword": "ნატურალური გრანიტი",
    "date": "2025-01-22",
  },
  {
    "slug": "graniti-kutaisi",
    "title": "გრანიტი ქუთაისში — სად ვიყიდოთ და შევუკვეთოთ",
    "desc": "გრანიტი ქუთაისში: გრანიტის ფილები, კიბე და ბლოკი ადგილობრივი ქარხნიდან. მისამართი, ტელეფონი და შეკვეთის წესი.",
    "keyword": "გრანიტი ქუთაისი",
    "date": "2025-01-24",
  },
  {
    "slug": "graniti-tbilisi",
    "title": "გრანიტის ფილები თბილისში — მიწოდება ქუთაისიდან",
    "desc": "გრანიტის ფილები და გრანიტის კიბე თბილისის პროექტებისთვის. შეკვეთა ქუთაისის ქვის ქარხანაში, მიწოდება დედაქალაქში.",
    "keyword": "გრანიტის ფილები თბილისი",
    "date": "2025-01-26",
  },
  {
    "slug": "graniti-batumi",
    "title": "გრანიტი ბათუმში — ზღვისპირა პროექტებისთვის",
    "desc": "გრანიტის ფილები და გარე ქვაფენილი ბათუმის კლიმატისთვის. რატომ არის გრანიტი იდეალური ტენიანი და მარილიანი გარემოსთვის.",
    "keyword": "გრანიტი ბათუმი",
    "date": "2025-01-28",
  },
  {
    "slug": "granitis-qvafenili",
    "title": "გრანიტის ქვაფენილი — გარე სივრცეებისთვის",
    "desc": "გრანიტის ქვაფენილი ეზოს, ტერასისა და ბილიკებისთვის. გამძლეობა, ანტისრიალა ზედაპირი და მოვლის რჩევები.",
    "keyword": "გრანიტის ქვაფენილი",
    "date": "2025-01-30",
  },
  {
    "slug": "granitis-bordiuri",
    "title": "გრანიტის ბორდიური — გზებისა და ტროტუარებისთვის",
    "desc": "გრანიტის ბორდიური სამშენებლო და ლანდშაფტური პროექტებისთვის. სიმტკიცე, ზომები და შეკვეთა ქუთაისიდან.",
    "keyword": "გრანიტის ბორდიური",
    "date": "2025-02-01",
  },
  {
    "slug": "polirebuli-granitis-fila",
    "title": "პოლირებული გრანიტის ფილა — პრემიუმ დასრულება",
    "desc": "პოლირებული გრანიტის ფილა ინტერიერისთვის: სარკისებრი ზედაპირი, მოვლა და სად გამოიყენება საუკეთესოდ.",
    "keyword": "პოლირებული გრანიტის ფილა",
    "date": "2025-02-03",
  },
  {
    "slug": "granitis-samzareulo",
    "title": "გრანიტის სამზარეულოს ზედაპირი — პრაქტიკული გზამკვლევი",
    "desc": "გრანიტის სამზარეულოს ზედაპირი: სითბოსადმი მედეგობა, ჰიგიენა, ფერები და რატომ ირჩევენ გრანიტს სამზარეულოში.",
    "keyword": "გრანიტის სამზარეულო",
    "date": "2025-02-05",
  },
  {
    "slug": "granitis-zedapiri",
    "title": "გრანიტის ზედაპირი — მაგიდები და კაუნთერთოფები",
    "desc": "გრანიტის ზედაპირი მაგიდებისა და ბარისთვის. ინდივიდუალური ზომები, კიდეების პროფილი და მოვლა.",
    "keyword": "გრანიტის ზედაპირი",
    "date": "2025-02-07",
  },
  {
    "slug": "granitis-fasi",
    "title": "გრანიტის ფასი საქართველოში — რაზეა დამოკიდებული",
    "desc": "გრანიტის ფილის, კიბისა და ბლოკის ფასი: რა განსაზღვრავს ღირებულებას და როგორ მივიღოთ ზუსტი შეთავაზება.",
    "keyword": "გრანიტის ფასი",
    "date": "2025-02-09",
  },
  {
    "slug": "granitis-filebi-iyataki",
    "title": "გრანიტის ფილები იატაკისთვის — რჩევები არჩევანზე",
    "desc": "გრანიტის ფილები იატაკზე: სისქე, ზედაპირის ტიპი, სრიალის რისკი და ჰარმონია ინტერიერთან.",
    "keyword": "გრანიტის ფილები იატაკი",
    "date": "2025-02-11",
  },
  {
    "slug": "granitis-filebi-kedeli",
    "title": "გრანიტის ფილები კედლის მოსაპირკეთებლად",
    "desc": "გრანიტის ფილა კედელზე: ფასადები, შიდა აკცენტები და სველი წერტილები. მონტაჟისა და დიზაინის რჩევები.",
    "keyword": "გრანიტის ფილები კედელი",
    "date": "2025-02-13",
  },
  {
    "slug": "granitis-filebi-terasa",
    "title": "გრანიტის ფილები ტერასისთვის",
    "desc": "გრანიტის ფილები ტერასაზე: ყინვაგამძლეობა, წყალგამძლეობა და ანტისრიალა დასრულება გარე სივრცეებისთვის.",
    "keyword": "გრანიტის ფილები ტერასა",
    "date": "2025-02-15",
  },
  {
    "slug": "granitis-filebi-auzi",
    "title": "გრანიტის ფილა აუზის გარშემო",
    "desc": "გრანიტის აუზის ფილა: სრიალისადმი მდგრადი ზედაპირი, ქლორისადმი მედეგობა და ესთეტიკა.",
    "keyword": "გრანიტის ფილა აუზი",
    "date": "2025-02-17",
  },
  {
    "slug": "granitis-karnizebi",
    "title": "გრანიტის კარნიზები — არქიტექტურული დეტალები",
    "desc": "გრანიტის კარნიზები ფასადებისა და ინტერიერისთვის. ზუსტი ჭრა და ინდივიდუალური პროფილები ქუთაისიდან.",
    "keyword": "გრანიტის კარნიზები",
    "date": "2025-02-19",
  },
  {
    "slug": "granitis-saniagvre",
    "title": "გრანიტის სანიაღვრე — პრაქტიკული გადაწყვეტა",
    "desc": "გრანიტის სანიაღვრე ეზოსა და გზებისთვის. გამძლეობა, წყლის გადინება და სამშენებლო სტანდარტები.",
    "keyword": "გრანიტის სანიაღვრე",
    "date": "2025-02-21",
  },
  {
    "slug": "granitis-fanjaris-rafe",
    "title": "გრანიტის ფანჯრის რაფები",
    "desc": "გრანიტის ფანჯრის რაფა: ტენისადმი მდგრადობა, სისუფთავე და ჰარმონია ფანჯრის ჩარჩოსთან.",
    "keyword": "გრანიტის ფანჯრის რაფა",
    "date": "2025-02-23",
  },
  {
    "slug": "granitis-bukhari",
    "title": "გრანიტის ბუხარი — სითბო და სტილი",
    "desc": "გრანიტის ბუხრის მოპირკეთება: სითბოსადმი მედეგობა, დიზაინის ვარიანტები და უსაფრთხოება.",
    "keyword": "გრანიტის ბუხარი",
    "date": "2025-02-25",
  },
  {
    "slug": "graniti-an-marmaro",
    "title": "გრანიტი თუ მარმარილო — რომელი ავირჩიოთ",
    "desc": "გრანიტისა და მარმარილოს შედარება: სიმტკიცე, ფორიანობა, ფასი და სად რომელია უკეთესი.",
    "keyword": "გრანიტი მარმარილო",
    "date": "2025-02-27",
  },
  {
    "slug": "granitis-filebis-movla",
    "title": "გრანიტის ფილების მოვლა და გაწმენდა",
    "desc": "როგორ მოვუაროთ გრანიტის ფილას: ყოველდღიური წმენდა, ლაქების მოცილება და რა ქიმიკატები ავირიდოთ.",
    "keyword": "გრანიტის ფილების მოვლა",
    "date": "2025-03-01",
  },
  {
    "slug": "granitis-montazhi",
    "title": "გრანიტის ფილების მონტაჟი — რა უნდაითვალისწინოთ",
    "desc": "გრანიტის ფილის მონტაჟი: საფუძველი, წებო, ნაკერები და პროფესიონალური დაყენების მნიშვნელობა.",
    "keyword": "გრანიტის მონტაჟი",
    "date": "2025-03-03",
  },
  {
    "slug": "granitis-feri-da-dizaini",
    "title": "გრანიტის ფერები და დიზაინი ინტერიერში",
    "desc": "გრანიტის ფერების არჩევანი: მუქი, ღია და ჭრელი ნიმუშები. როგორ შევუთავსოთ ავეჯსა და კედლებს.",
    "keyword": "გრანიტის ფერები",
    "date": "2025-03-05",
  },
  {
    "slug": "granitis-filebi-savel-otaxshi",
    "title": "გრანიტის ფილები სველ ოთახში",
    "desc": "გრანიტი აბაზანასა და სველ წერტილებში: ტენისადმი მდგრადობა, ჰიგიენა და ანტისრიალა ვარიანტები.",
    "keyword": "გრანიტი აბაზანა",
    "date": "2025-03-07",
  },
  {
    "slug": "granitis-kibe-saxli",
    "title": "გრანიტის კიბე კერძო სახლისთვის",
    "desc": "გრანიტის კიბე სახლში: სტილი, უსაფრთხოება, საფეხურის სიმაღლე და ინდივიდუალური შეკვეთა.",
    "keyword": "გრანიტის კიბე სახლი",
    "date": "2025-03-09",
  },
  {
    "slug": "granitis-kibe-gare",
    "title": "გრანიტის კიბე გარე შესასვლელისთვის",
    "desc": "გარე გრანიტის კიბე: ყინვა, წვიმა და უსაფრთხო საფეხური. რატომ არის გრანიტი საუკეთესო გარე კიბისთვის.",
    "keyword": "გრანიტის კიბე გარე",
    "date": "2025-03-11",
  },
  {
    "slug": "granitis-bloki-mshenebloba",
    "title": "გრანიტის ბლოკი მშენებლობაში",
    "desc": "გრანიტის ბლოკის როლი სამშენებლო პროექტებში: საყრდენი ელემენტები, მასიური დეტალები და ხანგრძლივობა.",
    "keyword": "გრანიტის ბლოკი მშენებლობა",
    "date": "2025-03-13",
  },
  {
    "slug": "granitis-qarxana",
    "title": "გრანიტის ქარხანა ქუთაისში — რას უნდაიგებთ ადგილზე",
    "desc": "ვიზიტი გრანიტის ქარხანაში: ნიმუშების ნახვა, ზომების განხილვა და შეკვეთის გაფორმება ქუთაისში.",
    "keyword": "გრანიტის ქარხანა",
    "date": "2025-03-15",
  },
  {
    "slug": "granitis-filebi-ofisi",
    "title": "გრანიტის ფილები ოფისსა და კომერციულ სივრცეში",
    "desc": "გრანიტი კომერციულ პროექტებში: გამძლეობა მაღალი ტრაფიკისას, პროფესიონალური იერსახე და მოვლა.",
    "keyword": "გრანიტი ოფისი",
    "date": "2025-03-17",
  },
  {
    "slug": "granitis-filebi-restorani",
    "title": "გრანიტი რესტორნებსა და კაფეებში",
    "desc": "გრანიტის ზედაპირები და იატაკი ჰორეკა სექტორში: ჰიგიენა, სიმტკიცე და ელეგანტური ინტერიერი.",
    "keyword": "გრანიტი რესტორანი",
    "date": "2025-03-19",
  },
  {
    "slug": "granitis-siskhe",
    "title": "გრანიტის ფილის სისქე — რომელი ავირჩიოთ",
    "desc": "გრანიტის ფილის სისქე იატაკის, კედლისა და გარე სამუშაოებისთვის. პრაქტიკული რეკომენდაციები.",
    "keyword": "გრანიტის ფილის სისქე",
    "date": "2025-03-21",
  },
  {
    "slug": "granitis-zomebi",
    "title": "გრანიტის ფილების სტანდარტული და ინდივიდუალური ზომები",
    "desc": "გრანიტის ფილის ზომები: სტანდარტული ფორმატები და შეკვეთით დამზადება თქვენი პროექტისთვის.",
    "keyword": "გრანიტის ფილების ზომები",
    "date": "2025-03-23",
  },
  {
    "slug": "matirebuli-graniti",
    "title": "მატირებული გრანიტი — ბუნებრივი ტექსტურა",
    "desc": "მატირებული გრანიტის ფილა: ნაკლები სრიალი, რბილი ბზინვა და იდეალური არჩევანი გარე და სველი სივრცეებისთვის.",
    "keyword": "მატირებული გრანიტი",
    "date": "2025-03-25",
  },
  {
    "slug": "granitis-kideebi",
    "title": "გრანიტის კიდეების დამუშავება — პროფილები",
    "desc": "გრანიტის კიდეების ტიპები: სწორი, მომრგვალებული და პროფილირებული. რა ჯდება ზედაპირებსა და საფეხურებზე.",
    "keyword": "გრანიტის კიდეები",
    "date": "2025-03-27",
  },
  {
    "slug": "graniti-ekologia",
    "title": "გრანიტი და ეკოლოგია — ბუნებრივი მასალა",
    "desc": "რატომ არის ნატურალური გრანიტი მდგრადი არჩევანი: ხანგრძლივი სიცოცხლე, გადამუშავებადობა და ნაკლები ნარჩენი.",
    "keyword": "გრანიტი ეკოლოგია",
    "date": "2025-03-29",
  },
  {
    "slug": "granitis-filebi-sadzlebeli",
    "title": "გრანიტის ფილები საძლებელ ოთახსა და დერეფანში",
    "desc": "გრანიტი საცხოვრებელ სივრცეებში: სიმშვიდე, სითბო ვიზუალურად და პრაქტიკული იატაკი დერეფნისთვის.",
    "keyword": "გრანიტი საძინებელი",
    "date": "2025-03-31",
  },
  {
    "slug": "granitis-shekveta",
    "title": "როგორ შევუკვეთოთ გრანიტის ფილები სწორად",
    "desc": "გრანიტის შეკვეთის ნაბიჯები: ზომები, ნიმუში, ვადები და კონტაქტი ქუთაისის ქვის ქარხანასთან.",
    "keyword": "გრანიტის შეკვეთა",
    "date": "2025-04-02",
  },
  {
    "slug": "granitis-misawodeba",
    "title": "გრანიტის მიწოდება საქართველოში",
    "desc": "გრანიტის ფილებისა და კიბის მიწოდება ქუთაისიდან თბილისში, ბათუმსა და სხვა ქალაქებში.",
    "keyword": "გრანიტის მიწოდება",
    "date": "2025-04-04",
  },
  {
    "slug": "graniti-zimashi",
    "title": "გრანიტი ზამთარში — ყინვაგამძლეობა",
    "desc": "როგორ იქცევა გრანიტი ყინვაში: გარე ფილები, კიბე და ქვაფენილი საქართველოს კლიმატში.",
    "keyword": "გრანიტი ყინვა",
    "date": "2025-04-06",
  },
  {
    "slug": "granitis-filebi-ezoshi",
    "title": "გრანიტის ფილები ეზოს მოსაწყობად",
    "desc": "ეზოს გრანიტის ფილები და ქვაფენილი: დიზაინი, დრენაჟი და ხანგრძლივი გარე იატაკი.",
    "keyword": "გრანიტის ფილები ეზო",
    "date": "2025-04-08",
  },
  {
    "slug": "granitis-baris-zedapiri",
    "title": "გრანიტის ბარის ზედაპირი",
    "desc": "გრანიტის ბარის ზედაპირი სახლსა და კომერციულ სივრცეში: სიმტკიცე, სტილი და ადვილი მოვლა.",
    "keyword": "გრანიტის ბარი",
    "date": "2025-04-10",
  },
  {
    "slug": "granitis-magida",
    "title": "გრანიტის მაგიდა შეკვეთით",
    "desc": "ინდივიდუალური გრანიტის მაგიდა: ზომა, ფერი, კიდეები და შეკვეთა ქუთაისის ქვის ქარხანაში.",
    "keyword": "გრანიტის მაგიდა",
    "date": "2025-04-12",
  },
  {
    "slug": "granitis-xarisxi",
    "title": "როგორ ამოვიცნოთ ხარისხიანი გრანიტის ფილა",
    "desc": "ხარისხიანი გრანიტის ნიშნები: ერთგვაროვნება, ბზარების არარსებობა, სწორი ჭრა და სანდო მწარმოებელი.",
    "keyword": "ხარისხიანი გრანიტი",
    "date": "2025-04-14",
  },
  {
    "slug": "graniti-imereti",
    "title": "გრანიტი იმერეთში — ადგილობრივი წარმოება",
    "desc": "გრანიტის წარმოება იმერეთში და ქუთაისში: უპირატესობები ადგილობრივი ქარხნის არჩევისა.",
    "keyword": "გრანიტი იმერეთი",
    "date": "2025-04-16",
  },
  {
    "slug": "granitis-proeqti-dackeba",
    "title": "გრანიტის პროექტის დაწყება — უფასო კონსულტაცია",
    "desc": "როგორ დავიწყოთ გრანიტის პროექტი: კონსულტაცია, ნიმუშები, ფასი და კონტაქტი ქუთაისის ქვის ქარხანასთან.",
    "keyword": "გრანიტის კონსულტაცია",
    "date": "2025-04-18",
  },
]

assert len(ARTICLES) == 50, len(ARTICLES)


def body_for(a: dict) -> str:
    kw = a["keyword"]
    title = a["title"]
    # Unique structured body per keyword theme
    return f"""
      <p class="lead">
        <strong>{kw}</strong> ერთ-ერთი ყველაზე მოთხოვნადი ქვის პროდუქტია საქართველოში.
        ქუთაისის ქვის ქარხანა 2019 წლიდან ამუშავებს ნატურალურ გრანიტს და ეხმარება
        კლიენტებს სწორი არჩევანის გაკეთებაში — საცხოვრებელი თუ კომერციული პროექტისთვის.
      </p>

      <h2>რატომ ირჩევენ {kw}-ს</h2>
      <p>
        ნატურალური გრანიტი გამოირჩევა სიმტკიცით, სითბოსადმი მედეგობითა და უნიკალური
        ვიზუალით. {kw} კარგი არჩევანია, თუ გსურთ მასალა, რომელიც წლების განმავლობაში
        ინარჩუნებს იერსახეს და არ საჭიროებს ხშირ შეცვლას. ჩვენს საწარმოში შეგიძლიათ
        ნახოთ ნიმუშები და შეადაროთ სხვადასხვა დასრულება — პოლირებული, მატირებული ან
        ტექსტურირებული ზედაპირი.
      </p>

      <h2>სად გამოიყენება</h2>
      <p>
        {kw} გამოიყენება იატაკზე, კედელზე, ტერასაზე, კიბეზე, სამზარეულოს ზედაპირებზე
        და გარე სივრცეებში. კონკრეტული გამოყენება დამოკიდებულია სისქეზე, ზედაპირის
        ტიპსა და პროექტის პირობებზე. თუ ეძებთ
        <a href="../products.html">გრანიტის ფილებს, გრანიტის კიბეს ან გრანიტის ბლოკს</a>,
        ჩვენი კატალოგი დაგეხმარებათ ორიენტაციაში.
      </p>
      <ul>
        <li>შიდა იატაკი და დერეფნები</li>
        <li>გარე ტერასები და ეზოები</li>
        <li>კიბეები და საფეხურები</li>
        <li>სამზარეულოსა და ბარის ზედაპირები</li>
        <li>არქიტექტურული და მასიური დეტალები</li>
      </ul>

      <h2>როგორ ავირჩიოთ სწორი ვარიანტი</h2>
      <p>
        არჩევანისას გაითვალისწინეთ: ზომა, სისქე, ფერი, ზედაპირის დასრულება და
        მონტაჟის ადგილი. გარე სივრცეებისთვის უმჯობესია ანტისრიალა ან მატირებული
        გრანიტი; ინტერიერში ხშირად ირჩევენ პოლირებულ გრანიტის ფილას. ჩვენი გუნდი
        უფასო კონსულტაციაზე გეტყვით, რომელი {kw} ჯდება თქვენს პროექტში.
      </p>

      <h2>ფასი და შეკვეთა</h2>
      <p>
        გრანიტის ფასი დამოკიდებულია მასალის ტიპზე, ზომასა და დამუშავებაზე.
        ზუსტი შეთავაზებისთვის დაგვირეკეთ ან ეწვიეთ ქარხანას ქუთაისში,
        ახალგაზრდობის გამზირი N19. აგრეთვე შეგიძლიათ
        <a href="../contact.html">შეავსოთ საკონტაქტო ფორმა</a>.
      </p>
      <p>
        ვემსახურებით მთელ საქართველოს — ქუთაისი, თბილისი, ბათუმი და სხვა ქალაქები.
        თემასთან დაკავშირებით წაიკითხეთ აგრეთვე სხვა სტატიები ჩვენს
        <a href="index.html">გრანიტის ბლოგში</a>.
      </p>

      <h2>შეჯამება</h2>
      <p>
        {title.split("—")[0].strip()} პრაქტიკული და ესთეტიკური გადაწყვეტაა ქართული
        სახლებისა და ბიზნესებისთვის. თუ გჭირდებათ {kw}, გრანიტის ფილები, გრანიტის
        ბლოკი ან გრანიტის კიბე — ქუთაისის ქვის ქარხანა მზად არის დაგეხმაროთ
        არჩევანიდან მონტაჟამდე.
      </p>
    """


NAV = """
            <ul>
              <li><a class="nav" href="{home}">მთავარი</a></li>
              <li><a class="nav" href="{about}">ჩვენს შესახებ</a></li>
              <li><a class="nav" href="{products}">სერვისები</a></li>
              <li><a class="nav" href="{blog}">ბლოგი</a></li>
              <li><a class="nav" href="{contact}">კონტაქტი</a></li>
              <li>
                <div class="menu" id="menu" onclick="toggleMenu()">
                  <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                </div>
                <div class="nav-menu" id="navMenu">
                  <a href="{home}">მთავარი</a>
                  <a href="{about}">ჩვენს შესახებ</a>
                  <a href="{products}">სერვისები</a>
                  <a href="{blog}">ბლოგი</a>
                  <a href="{contact}">კონტაქტი</a>
                </div>
              </li>
            </ul>
"""


def header(prefix: str) -> str:
    nav = NAV.format(
        home=f"{prefix}index.html",
        about=f"{prefix}aboutus.html",
        products=f"{prefix}products.html",
        blog=f"{prefix}blog/index.html" if prefix == "../" else "index.html" if prefix == "" and "blog" in str(BLOG) else f"{prefix}blog/index.html",
        contact=f"{prefix}contact.html",
    )
    # Fix blog link when we're inside blog/
    if prefix == "../":
        nav = NAV.format(
            home="../index.html",
            about="../aboutus.html",
            products="../products.html",
            blog="index.html",
            contact="../contact.html",
        )
    logo = f"{prefix}images/logo-300.webp"
    return f"""
        <header>
          <div class="container">
            <a href="{prefix}index.html">
              <img width="300" height="164" src="{logo}" alt="ქუთაისის ქვის ქარხანის ლოგო" id="logo-img" />
            </a>
            <h2 style="margin-left: 5px">
              <a href="{prefix}index.html" class="linki">ქუთაისის ქვის ქარხანა</a>
            </h2>
            {nav}
          </div>
        </header>
"""


def footer(prefix: str) -> str:
    return f"""
        <footer>
          <h3 class="stone">ქვის</h3>
          <h3>ქარხანა</h3>
          <div class="icons">
            <a aria-label="Instagram" href="https://www.instagram.com/qutaisisqvisqarxana/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram fa-2xl"></i></a>
            <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=100088853137969" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook fa-2xl"></i></a>
          </div>
          <div class="foot-nav">
            <a href="{prefix}index.html">მთავარი</a>
            <a href="{prefix}aboutus.html">ჩვენს შესახებ</a>
            <a href="{prefix}products.html">სერვისები</a>
            <a href="{prefix}blog/index.html">ბლოგი</a>
            <a href="{prefix}contact.html">კონტაქტი</a>
          </div>
        </footer>
        <script>
          function toggleMenu() {{
            document.getElementById("navMenu").classList.toggle("active");
            document.getElementById("menu").classList.toggle("open");
          }}
        </script>
"""


CSS = """
    <style>
      :root { --ink:#1a1a2e; --muted:#555; --gold:#8b6914; --bg:#f7f4ef; }
      body { margin:0; font-family:"Noto Sans Georgian", system-ui, sans-serif; color:var(--ink); background:#fff; }
      .blog-wrap { max-width:780px; margin:0 auto; padding:40px 20px 80px; }
      .blog-wrap h1 { font-size:clamp(1.7rem,4vw,2.4rem); line-height:1.25; margin:12px 0 8px; }
      .blog-meta { color:var(--muted); font-size:.95rem; margin-bottom:28px; }
      .blog-wrap .lead { font-size:1.08rem; line-height:1.75; color:#333; }
      .blog-wrap h2 { margin-top:2rem; font-size:1.35rem; }
      .blog-wrap p, .blog-wrap li { line-height:1.75; color:#444; }
      .blog-wrap a { color:var(--gold); font-weight:600; }
      .blog-hero {
        background: linear-gradient(135deg,#1a1a2e 0%,#2c3e50 60%,#3d4f3f 100%);
        color:#fff; padding:72px 20px 56px; text-align:center;
      }
      .blog-hero h1 { color:#fff; margin:0 auto; max-width:860px; }
      .blog-hero p { color:rgba(255,255,255,.85); max-width:640px; margin:14px auto 0; }
      .blog-list { max-width:960px; margin:0 auto; padding:48px 20px 80px; display:grid; gap:18px; }
      .blog-card {
        display:block; padding:22px 24px; border-bottom:1px solid #e8e4dc;
        text-decoration:none; color:inherit;
      }
      .blog-card:hover { background:var(--bg); }
      .blog-card h2 { margin:0 0 8px; font-size:1.2rem; color:var(--ink); }
      .blog-card p { margin:0; color:var(--muted); line-height:1.6; }
      .blog-card .date { font-size:.85rem; color:#888; margin-bottom:6px; display:block; }
      .crumb { font-size:.9rem; margin-bottom:8px; color:var(--muted); }
      .crumb a { color:var(--gold); }
      .related { margin-top:40px; padding-top:24px; border-top:1px solid #e8e4dc; }
      .related h2 { margin-top:0; }
      .related ul { padding-left:1.2rem; }
    </style>
"""


def article_html(a: dict, related: list[dict]) -> str:
    url = f"{SITE}/blog/{a['slug']}.html"
    related_html = "\n".join(
        f'<li><a href="{r["slug"]}.html">{r["title"]}</a></li>' for r in related
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": a["title"],
        "description": a["desc"],
        "inLanguage": "ka-GE",
        "datePublished": a["date"],
        "dateModified": a["date"],
        "author": {"@type": "Organization", "name": "ქუთაისის ქვის ქარხანა", "url": SITE},
        "publisher": {
            "@type": "Organization",
            "name": "ქუთაისის ქვის ქარხანა",
            "logo": {"@type": "ImageObject", "url": f"{SITE}/images/logo.png"},
        },
        "mainEntityOfPage": url,
        "keywords": f'{a["keyword"]}, გრანიტის ფილები, გრანიტის ფილა, გრანიტის ბლოკი, გრანიტის კიბე',
    }
    return f"""<!doctype html>
<html lang="ka">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{a["title"]} | ქუთაისის ქვის ქარხანა</title>
    <meta name="description" content="{a["desc"]}" />
    <meta name="keywords" content="{a["keyword"]}, გრანიტის ფილები, გრანიტის ფილა, გრანიტის ბლოკი, გრანიტის კიბე, გრანიტი საქართველო" />
    <meta name="author" content="ქუთაისის ქვის ქარხანა" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="language" content="Georgian" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="ქუთაისის ქვის ქარხანა" />
    <meta property="og:title" content="{a["title"]}" />
    <meta property="og:description" content="{a["desc"]}" />
    <meta property="og:locale" content="ka_GE" />
    <meta property="og:url" content="{url}" />
    <meta property="og:image" content="{SITE}/images/IMG_0844.JPG" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{a["title"]}" />
    <meta name="twitter:description" content="{a["desc"]}" />
    <link rel="canonical" href="{url}" />
    <link rel="alternate" hreflang="ka-GE" href="{url}" />
    <link rel="alternate" hreflang="ka" href="{url}" />
    <link rel="icon" href="../images/Artboard 2-8.png" type="image/x-icon" />
    <link rel="stylesheet" href="../site.min.css" />
    <link rel="stylesheet" href="../icons.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400..900&display=swap" rel="stylesheet" />
    {CSS}
    <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
  </head>
  <body>
    {header("../")}
    <main>
      <article class="blog-wrap">
        <nav class="crumb" aria-label="breadcrumb">
          <a href="../index.html">მთავარი</a> /
          <a href="index.html">ბლოგი</a> /
          <span>{a["keyword"]}</span>
        </nav>
        <h1>{a["title"]}</h1>
        <p class="blog-meta">განახლებულია: {a["date"]} · ქუთაისის ქვის ქარხანა</p>
        {body_for(a)}
        <aside class="related">
          <h2>მსგავსი სტატიები</h2>
          <ul>{related_html}</ul>
        </aside>
      </article>
    </main>
    {footer("../").replace(f'{prefix}blog/index.html' if False else '', '')}
  </body>
</html>
"""


# Fix footer for articles - the replace above is messy. Redefine cleanly.

def article_html(a: dict, related: list[dict]) -> str:
    url = f"{SITE}/blog/{a['slug']}.html"
    related_html = "\n".join(
        f'<li><a href="{r["slug"]}.html">{r["title"]}</a></li>' for r in related
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": a["title"],
        "description": a["desc"],
        "inLanguage": "ka-GE",
        "datePublished": a["date"],
        "dateModified": a["date"],
        "author": {"@type": "Organization", "name": "ქუთაისის ქვის ქარხანა", "url": SITE},
        "publisher": {
            "@type": "Organization",
            "name": "ქუთაისის ქვის ქარხანა",
            "logo": {"@type": "ImageObject", "url": f"{SITE}/images/logo.png"},
        },
        "mainEntityOfPage": url,
        "keywords": f'{a["keyword"]}, გრანიტის ფილები, გრანიტის ფილა, გრანიტის ბლოკი, გრანიტის კიბე',
    }
    foot = f"""
        <footer>
          <h3 class="stone">ქვის</h3>
          <h3>ქარხანა</h3>
          <div class="icons">
            <a aria-label="Instagram" href="https://www.instagram.com/qutaisisqvisqarxana/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram fa-2xl"></i></a>
            <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=100088853137969" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook fa-2xl"></i></a>
          </div>
          <div class="foot-nav">
            <a href="../index.html">მთავარი</a>
            <a href="../aboutus.html">ჩვენს შესახებ</a>
            <a href="../products.html">სერვისები</a>
            <a href="index.html">ბლოგი</a>
            <a href="../contact.html">კონტაქტი</a>
          </div>
        </footer>
        <script>
          function toggleMenu() {{
            document.getElementById("navMenu").classList.toggle("active");
            document.getElementById("menu").classList.toggle("open");
          }}
        </script>
"""
    return f"""<!doctype html>
<html lang="ka">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{a["title"]} | ქუთაისის ქვის ქარხანა</title>
    <meta name="description" content="{a["desc"]}" />
    <meta name="keywords" content="{a["keyword"]}, გრანიტის ფილები, გრანიტის ფილა, გრანიტის ბლოკი, გრანიტის კიბე, გრანიტი საქართველო" />
    <meta name="author" content="ქუთაისის ქვის ქარხანა" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <meta name="language" content="Georgian" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="ქუთაისის ქვის ქარხანა" />
    <meta property="og:title" content="{a["title"]}" />
    <meta property="og:description" content="{a["desc"]}" />
    <meta property="og:locale" content="ka_GE" />
    <meta property="og:url" content="{url}" />
    <meta property="og:image" content="{SITE}/images/IMG_0844.JPG" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{a["title"]}" />
    <meta name="twitter:description" content="{a["desc"]}" />
    <link rel="canonical" href="{url}" />
    <link rel="alternate" hreflang="ka-GE" href="{url}" />
    <link rel="alternate" hreflang="ka" href="{url}" />
    <link rel="icon" href="../images/Artboard 2-8.png" type="image/x-icon" />
    <link rel="stylesheet" href="../site.min.css" />
    <link rel="stylesheet" href="../icons.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400..900&display=swap" rel="stylesheet" />
    {CSS}
    <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
  </head>
  <body>
    {header("../")}
    <main>
      <article class="blog-wrap">
        <nav class="crumb" aria-label="breadcrumb">
          <a href="../index.html">მთავარი</a> /
          <a href="index.html">ბლოგი</a> /
          <span>{a["keyword"]}</span>
        </nav>
        <h1>{a["title"]}</h1>
        <p class="blog-meta">განახლებულია: {a["date"]} · ქუთაისის ქვის ქარხანა</p>
        {body_for(a)}
        <aside class="related">
          <h2>მსგავსი სტატიები</h2>
          <ul>
            {related_html}
          </ul>
        </aside>
      </article>
    </main>
    {foot}
  </body>
</html>
"""


def index_html() -> str:
    cards = "\n".join(
        f'''        <a class="blog-card" href="{a["slug"]}.html">
          <span class="date">{a["date"]}</span>
          <h2>{a["title"]}</h2>
          <p>{a["desc"]}</p>
        </a>'''
        for a in ARTICLES
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "გრანიტის ბლოგი — ქუთაისის ქვის ქარხანა",
        "description": "სტატიები გრანიტის ფილებზე, გრანიტის ბლოკზე, გრანიტის კიბეზე და გრანიტის დამუშავებაზე საქართველოში.",
        "url": f"{SITE}/blog/",
        "inLanguage": "ka-GE",
        "publisher": {"@type": "Organization", "name": "ქუთაისის ქვის ქარხანა"},
        "blogPost": [
            {
                "@type": "BlogPosting",
                "headline": a["title"],
                "url": f"{SITE}/blog/{a['slug']}.html",
                "datePublished": a["date"],
                "description": a["desc"],
            }
            for a in ARTICLES
        ],
    }
    foot = """
        <footer>
          <h3 class="stone">ქვის</h3>
          <h3>ქარხანა</h3>
          <div class="icons">
            <a aria-label="Instagram" href="https://www.instagram.com/qutaisisqvisqarxana/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram fa-2xl"></i></a>
            <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=100088853137969" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook fa-2xl"></i></a>
          </div>
          <div class="foot-nav">
            <a href="../index.html">მთავარი</a>
            <a href="../aboutus.html">ჩვენს შესახებ</a>
            <a href="../products.html">სერვისები</a>
            <a href="index.html">ბლოგი</a>
            <a href="../contact.html">კონტაქტი</a>
          </div>
        </footer>
        <script>
          function toggleMenu() {
            document.getElementById("navMenu").classList.toggle("active");
            document.getElementById("menu").classList.toggle("open");
          }
        </script>
"""
    return f"""<!doctype html>
<html lang="ka">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>გრანიტის ბლოგი — ფილები, კიბე, ბლოკი | ქუთაისის ქვის ქარხანა</title>
    <meta name="description" content="გრანიტის ბლოგი ქართულად: გრანიტის ფილები, გრანიტის ფილა, გრანიტის ბლოკი, გრანიტის კიბე, ფასი, მონტაჟი და მოვლა საქართველოში." />
    <meta name="keywords" content="გრანიტის ბლოგი, გრანიტის ფილები, გრანიტის ფილა, გრანიტის ბლოკი, გრანიტის კიბე, გრანიტი საქართველო" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="Georgian" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="გრანიტის ბლოგი | ქუთაისის ქვის ქარხანა" />
    <meta property="og:description" content="50+ სტატია გრანიტზე ქართულად — ფილები, კიბე, ბლოკი და დამუშავება." />
    <meta property="og:locale" content="ka_GE" />
    <meta property="og:url" content="{SITE}/blog/" />
    <meta property="og:image" content="{SITE}/images/IMG_0844.JPG" />
    <link rel="canonical" href="{SITE}/blog/" />
    <link rel="alternate" hreflang="ka-GE" href="{SITE}/blog/" />
    <link rel="icon" href="../images/Artboard 2-8.png" type="image/x-icon" />
    <link rel="stylesheet" href="../site.min.css" />
    <link rel="stylesheet" href="../icons.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400..900&display=swap" rel="stylesheet" />
    {CSS}
    <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
  </head>
  <body>
    {header("../")}
    <section class="blog-hero">
      <h1>გრანიტის ბლოგი</h1>
      <p>გრანიტის ფილები, გრანიტის ბლოკი, გრანიტის კიბე და პრაქტიკული რჩევები ქართულად</p>
    </section>
    <div class="blog-list">
{cards}
    </div>
    {foot}
  </body>
</html>
"""


def main() -> None:
    BLOG.mkdir(parents=True, exist_ok=True)
    for i, a in enumerate(ARTICLES):
        related = [ARTICLES[(i + j) % len(ARTICLES)] for j in (1, 2, 3)]
        (BLOG / f"{a['slug']}.html").write_text(article_html(a, related), encoding="utf-8")
    (BLOG / "index.html").write_text(index_html(), encoding="utf-8")

    # sitemap
    today = "2026-10-20"
    urls = [
        ("/", "1.0"),
        ("/products.html", "0.95"),
        ("/blog/", "0.9"),
        ("/aboutus.html", "0.7"),
        ("/contact.html", "0.8"),
    ]
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for path, prio in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{SITE}{path}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        lines.append("    <changefreq>weekly</changefreq>")
        lines.append(f"    <priority>{prio}</priority>")
        lines.append("  </url>")
    for a in ARTICLES:
        lines.append("  <url>")
        lines.append(f"    <loc>{SITE}/blog/{a['slug']}.html</loc>")
        lines.append(f"    <lastmod>{a['date']}</lastmod>")
        lines.append("    <changefreq>monthly</changefreq>")
        lines.append("    <priority>0.75</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")

    # manifest for nav updates
    (BLOG / "articles.json").write_text(
        json.dumps([{"slug": a["slug"], "title": a["title"], "date": a["date"]} for a in ARTICLES], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Generated {len(ARTICLES)} articles + index + sitemap")


if __name__ == "__main__":
    main()
