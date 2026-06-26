-- ============================================================================
-- Ludus demo seed — generated from lib/data.ts + lib/projects.ts.
-- Idempotent (on conflict do nothing). Run AFTER 0001_ludus_schema.sql.
-- Apply in the Supabase SQL editor for project ngifengeshwvyzhqvprn.
-- ============================================================================

begin;

-- Students
insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1042', 'Amélia', 'Nováková', 'Amka', 'ona', 'Dievča', '2008-03-14', 'Bratislava', 'Aktívny', 'Reklama', '3. ročník · Súbor A', 'Mgr. art Katarína Baranová ArtD.', '2022-09-01', 168, 56, 'Zelená', 'Gaštanová', 39, 'S', 'Soprán', '{"Belt spev","Balet","Javiskový súboj","Improvizácia"}', '{"Slovenčina","Angličtina","Nemčina"}', 92, null, null, 'Jana Nováková', 'Matka', '+421 905 112 334', 'jana.novakova@email.sk', 'Peter Novák · +421 905 998 221', 'Všestranná predstaviteľka hlavných úloh s jasným sopránom. Amélia exceluje v muzikálových číslach a odniesla tri inscenácie na hlavnej scéne.', 'Pripravená na konkurzy na hlavné úlohy. Pokračovať v práci na výslovnosti pri anglickom repertoári.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1043', 'Lukáš', 'Polák', null, 'on', 'Chlapec', '2009-07-22', 'Trenčín', 'Aktívny', 'Film/seriál', '2. ročník · Súbor B', 'Mgr. art Michal Rovňák', '2023-09-01', 179, 68, 'Modrá', 'Blond', 43, 'M', 'Barytón', '{"Klasický text","Javiskový súboj","Práca s maskou"}', '{"Slovenčina","Angličtina","Nemčina"}', 74, null, null, 'Marek Polák', 'Otec', '+421 905 412 778', 'marek.polak@email.sk', 'Eva Poláková · +421 905 771 020', 'Silný dramatický herec s prirodzeným zvládnutím klasického textu. Vyniká v súborových a záporných úlohách.', 'Pracovať na hlasovej projekcii vo väčších priestoroch. Treba obnoviť súhlas s fotením.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1044', 'Žofia', 'Rišková', null, 'ona', 'Dievča', '2010-11-03', 'Nitra', 'Aktívny', 'Reklama', '1. ročník · Základy', 'Mgr. art Mirka Durná ArtD.', '2024-09-01', 162, 49, 'Hnedá', 'Čierna', 38, 'XS', null, '{"Súčasný tanec","Jazz","Tanec na špičkách","Choreografia"}', '{"Slovenčina","Angličtina"}', 81, null, null, 'Gabriela Rišková', 'Matka', '+421 903 884 221', 'gabriela.riskova@email.sk', 'Marek Riško · +421 903 119 552', 'Talentovaná tanečnica súčasného tanca s výnimočnou flexibilitou a javiskovým prejavom nad jej vek.', 'Vynikajúca technika. Podporiť účasť na choreografii jarnej prehliadky.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1045', 'Saša', 'Lukáč', null, 'oni', 'Iné', '2007-05-19', 'Trnava', 'Aktívny', 'Film/seriál', '4. ročník · Maturitný', 'Mgr. art Soňa Borušovičová', '2021-09-01', 174, 63, 'Liesková', 'Hnedá', 42, 'M', 'Tenor', '{"Autorské divadlo","Verbatim","Prízvuky a dialekty","Bábkoherectvo"}', '{"Slovenčina","Angličtina","Francúzština"}', 88, null, null, 'Plnoletý', '—', '+421 944 900 145', 'sasa.lukac@email.sk', 'Klára Lukáčová · +421 944 900 980', 'Vynaliezavý, fyzicky expresívny performer so zameraním na autorskú a experimentálnu tvorbu. Prirodzený tímový hráč.', 'Pripravuje absolventské portfólio. Silný kandidát na agentúrnu prehliadku.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1046', 'Mia', 'Tomková', null, 'ona', 'Dievča', '2011-01-27', 'Komárno', 'Konkurz', 'Reklama', 'Uchádzači', 'Mgr. art Lenka Libjaková', '2026-05-20', 158, 47, 'Modrá', 'Blond', 37, 'XS', 'Mezzosoprán', '{"Stepovanie","Klavír","Spev z listu"}', '{"Slovenčina","Maďarčina","Angličtina"}', 58, null, null, 'Eva Tomková', 'Matka', '+421 911 884 110', 'eva.tomkova@email.sk', 'Tomáš Tomka · +421 911 552 901', 'Sľubná uchádzačka so silnou muzikalitou a teplým mezzosopránom. Aktuálne v konkurznom procese.', 'Naplánované druhé kolo. Pred skúšobným týždňom čakáme na súhlas rodiča.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1047', 'Eliáš', 'Hrebík', null, 'on', 'Chlapec', '2008-09-30', 'Žilina', 'Neaktívny', 'Iné', '2. ročník · Produkčný tím', 'Bc. Daniel Zwach', '2023-09-01', 182, 74, 'Sivá', 'Hnedá', 44, 'L', null, '{"Svetelný dizajn","Stavba scény","Závesná technika","Zvukový mix"}', '{"Slovenčina","Angličtina","Nemčina"}', 40, null, null, 'Andrej Hrebík', 'Otec', '+421 907 445 110', 'andrej.hrebik@email.sk', 'Lenka Hrebíková · +421 907 778 332', 'Precízny technik s citom pre atmosférické svetlo. Aktuálne na zdravotnom voľne počas jarného semestra.', 'Na voľne do jesene. Podržať miesto v produkčnom tíme; skontrolovať obnovu lekárskeho tlačiva.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1048', 'Izabela', 'Murínová', null, 'ona', 'Dievča', '2006-12-08', 'Banská Bystrica', 'Neaktívny', 'Film/seriál', 'Ročník 2025', 'Mgr. art Katarína Gurová', '2020-09-01', 165, 58, 'Jantárová', 'Čierna', 39, 'S', 'Alt', '{"Jazzový spev","Hudobná teória","Tvorba piesní","Klavír"}', '{"Slovenčina","Angličtina","Francúzština"}', 95, null, null, 'Absolventka', '—', '+421 902 448 821', 'izabela.murinova@email.sk', 'Žofia Murínová · +421 902 210 911', 'Absolvovala s vyznamenaním. Momentálne profesionálne účinkuje; zostáva v sieti absolventov pre majstrovské kurzy.', 'Absolventka. Pozvaná späť na jesennú sériu vokálnych majstrovských kurzov.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1049', 'Daniel', 'Horváth', null, 'on', 'Chlapec', '2009-04-11', 'Košice', 'Aktívny', 'Reklama', '2. ročník · Súbor B', 'Mgr. art Jakub Rek', '2023-09-01', 176, 66, 'Hnedá', 'Čierna', 42, 'M', 'Tenor', '{"Stepovanie","Belt spev","Akrobacia","Beatbox"}', '{"Slovenčina","Angličtina","Maďarčina"}', 79, null, null, 'Zuzana Horváthová', 'Matka', '+421 908 221 554', 'z.horvathova@email.sk', 'Ján Horváth · +421 908 110 442', 'Energický „triple-threat“ s výborným stepom a charizmatickým javiskovým prejavom.', 'Výrazný pokrok v hlasovom rozsahu. Odporúčaný na vedúcu súborovú úlohu v jesennej revue.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1050', 'Karolína', 'Bednárová', null, 'ona', 'Dievča', '2010-08-16', 'Poprad', 'Aktívny', 'Film/seriál', '1. ročník · Základy', 'Mgr. art Janko Mikuš', '2024-09-01', 160, 50, 'Zelená', 'Ryšavá', 38, 'S', null, '{"Improvizácia","Klauniáda","Rozprávačstvo"}', '{"Slovenčina","Angličtina","Nemčina"}', 64, null, null, 'Nina Bednárová', 'Matka', '+421 910 221 884', 'nina.bednarova@email.sk', 'Urban Bednár · +421 910 110 552', 'Pohotová komická herečka s darom pre improvizáciu a fyzickú komédiu.', 'Rozkvitá v komediálnej tvorbe. Budúci semester podporiť prácu na napísaných scénach.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1051', 'Adam', 'Tóth', null, 'on', 'Chlapec', '2008-02-05', 'Bratislava', 'Aktívny', 'Film/seriál', '3. ročník · Súbor A', 'Mgr. art Noro Šáro', '2022-09-01', 181, 72, 'Hnedá', 'Hnedá', 44, 'L', 'Bas', '{"Operná technika","Zborové dirigovanie","Hudobná teória"}', '{"Slovenčina","Taliančina","Angličtina"}', 86, null, null, 'Katarína Tóthová', 'Matka', '+421 911 332 778', 'k.tothova@email.sk', 'Michal Tóth · +421 911 221 009', 'Rezonujúci basový hlas s vážnym operným potenciálom. Premýšľavý a disciplinovaný hudobník.', 'Pripravuje sa na celoštátnu vokálnu súťaž. Vynikajúca práca s dychom.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1052', 'Ema', 'Lišková', null, 'ona', 'Dievča', '2009-10-21', 'Zvolen', 'Aktívny', 'Reklama', '2. ročník · Súbor B', 'Mgr. art Ria Benkovská', '2023-09-01', 170, 55, 'Modrá', 'Blond', 40, 'S', null, '{"Balet","Súčasný tanec","Párový tanec","Choreografia"}', '{"Slovenčina","Angličtina"}', 83, null, null, 'Andrea Lišková', 'Matka', '+421 948 884 221', 'andrea.liskova@email.sk', 'Erik Liška · +421 948 552 118', 'Elegantná klasická tanečnica, ktorá krásne prechádza do súčasného repertoáru.', 'Pekná línia a muzikalita. Zvážiť párové číslo na zimnej gala.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.ludus_students (id, first_name, last_name, preferred_name, pronouns, gender, date_of_birth, city, status, program, cohort, teacher, enrolled_on, height_cm, weight_kg, eye_color, hair_color, shoe_eu, clothing_size, voice_type, skills, languages, casting_readiness, phone, email, guardian_name, guardian_relation, guardian_phone, guardian_email, emergency_contact, bio, tutor_note, school, guardian_email2, apparent_age, ethnicity, body_type, hair_length, hair_type, beard, suit_size, chest_circumference, waist_circumference, hips_circumference, head_circumference, neck_circumference, voice_speak, distinctive_features, handicaps, instruments, dance_styles, sports, driving_licences, other_skills, other_talents, accent, ig_followers, tt_followers, yt_followers, fb_followers, url_web, url_ig, url_tt, url_yt, url_fb, url_li, url_imdb, url_csfd, url_idiv)
values ('STU-1053', 'Jakub', 'Šimko', null, 'on', 'Chlapec', '2010-06-12', 'Prešov', 'Konkurz', 'Iné', 'Uchádzači', 'Bc. Simon Fico', '2026-05-25', 172, 60, 'Liesková', 'Hnedá', 41, 'M', null, '{"Videoprojekcia","Programovanie","Zvukový dizajn"}', '{"Slovenčina","Angličtina"}', 52, null, null, 'Petra Šimková', 'Matka', '+421 950 221 884', 'petra.simkova@email.sk', 'Tomáš Šimko · +421 950 110 332', 'Technicky zdatný uchádzač so záujmom o projekciu a imerzívne médiá pre živé predstavenie.', 'Čaká sa na posúdenie portfólia. Silné technické predpoklady pre digitálnu javiskovú techniku.', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '{}', null, '{}', '{}', '{}', '{}', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
on conflict (id) do nothing;

-- Documents
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('b063f10a-e960-0661-922a-0f067c974529', 'STU-1042', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-02', 184, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('6ab99495-b5b5-c8c1-f93b-c24fb53b5cfc', 'STU-1042', 'Lekárske potvrdenie.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-04', 256, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('676d2fc6-b8a6-d850-97bb-cf535268c89a', 'STU-1042', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-09-02', 142, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('e72998fa-5be2-9d95-919f-0094090879a2', 'STU-1042', 'Zmluva o štúdiu 3.r.pdf', 'Zmluva o štúdiu', 'Podpísané', '2025-08-28', 320, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('e7191a78-5b90-56ba-789f-55c7ce03bc96', 'STU-1042', 'Vysvedčenie - jar.pdf', 'Vysvedčenie', 'Podpísané', '2026-02-12', 96, 'M. Kováč')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('6209c3ca-a770-4d79-51a2-e0308fedac28', 'STU-1043', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-05', 180, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('82e428f7-36bb-78f2-d98d-f1f3744db534', 'STU-1043', 'Lekárske tlačivo.pdf', 'Lekárske tlačivo', 'Čaká sa', '2025-09-10', 240, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('02bc4ef7-24f9-20f7-955e-d5aa5fd333c3', 'STU-1043', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Vypršané', '2024-09-01', 138, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('e72ef2b7-d9fc-7b96-3254-662f6f1060e2', 'STU-1043', 'Zmluva o štúdiu 2.r.pdf', 'Zmluva o štúdiu', 'Podpísané', '2025-08-30', 312, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('4fdd23eb-5e64-ccb4-f03c-a15a5ef2f78e', 'STU-1044', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-01', 176, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('9262642b-397f-5bb7-04a0-9c255b6d413f', 'STU-1044', 'Lekárske potvrdenie.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-03', 248, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('4a7d29d5-1d99-aa07-b97d-9d411cc8b5f1', 'STU-1044', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-09-01', 140, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('6d0df091-c09d-5c52-ecfe-b137e8385b5f', 'STU-1044', 'Rozhodnutie o štipendiu.pdf', 'Štipendium', 'Podpísané', '2025-07-15', 88, 'Riaditeľka')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('277accf0-9514-6fb3-ee76-cb6bdd825db2', 'STU-1045', 'Zmluva o štúdiu 4.r.pdf', 'Zmluva o štúdiu', 'Podpísané', '2025-08-25', 330, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('ae3aa0ab-1ea2-3f1b-be5d-dd324a059ef6', 'STU-1045', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-09-02', 144, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('2374fa24-8848-5995-26e3-796e2e7ca422', 'STU-1045', 'Lekárske tlačivo.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-06', 252, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('cf50829f-d79c-015b-a1e2-57a8de914f3e', 'STU-1045', 'Záverečné hodnotenie.pdf', 'Vysvedčenie', 'Podpísané', '2026-05-01', 104, 'Pedagóg')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('ff290270-c6d9-5ba1-b999-cfcb15f42df2', 'STU-1046', 'Prihláška na konkurz.pdf', 'Zmluva o štúdiu', 'Podpísané', '2026-05-20', 210, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('180d2042-25fa-655a-e853-374e17bd7c7a', 'STU-1046', 'Súhlas rodiča (skúšobné).pdf', 'Súhlas rodiča', 'Čaká sa', '2026-05-22', 0, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('5a2a1412-dbdb-4fb5-9cef-8afbad40f2ff', 'STU-1047', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-04', 178, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('01b2efe6-b58f-d93a-db2b-913c736e4696', 'STU-1047', 'Potvrdenie o prerušení.pdf', 'Lekárske tlačivo', 'Podpísané', '2026-02-01', 132, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('e9c9b216-9c6b-b391-4a2d-4c6ef03981d5', 'STU-1047', 'Zmluva o štúdiu 2.r.pdf', 'Zmluva o štúdiu', 'Podpísané', '2025-08-29', 308, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('5f2d7ef5-c147-05fe-b427-9dcd18b59cb5', 'STU-1048', 'Diplom o absolvovaní.pdf', 'Vysvedčenie', 'Podpísané', '2025-06-20', 120, 'Riaditeľka')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('0ec1f321-4b2c-5d39-2d15-af76d84fc389', 'STU-1048', 'Súhlas absolventa.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-06-22', 140, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('1051173d-5762-269b-e95e-c2ffeda79de9', 'STU-1049', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-03', 182, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('173542ba-49ec-4e1a-6cdb-84b1d0744314', 'STU-1049', 'Lekárske tlačivo.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-05', 244, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('60bbea0e-d688-7ff6-cd61-8c61f5fdc765', 'STU-1049', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-09-03', 141, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('9ac00d62-db48-1ad7-3eb0-82f36b4b905e', 'STU-1049', 'Zmluva o štúdiu 2.r.pdf', 'Zmluva o štúdiu', 'Podpísané', '2025-08-30', 310, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('58350596-3696-6da1-e0c4-62dc184ddc28', 'STU-1050', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-02', 179, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('81e38900-e861-d02e-8281-9c43514738c1', 'STU-1050', 'Lekárske potvrdenie.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-04', 250, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('a94de831-b46f-e28c-17fb-7d43f322a474', 'STU-1050', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Čaká sa', '2025-09-09', 0, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('54e2e79b-044f-8119-2324-93078d1e58dd', 'STU-1051', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-01', 181, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('bbe11a70-520f-f3db-2215-50fda7136d08', 'STU-1051', 'Lekárske tlačivo.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-03', 246, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('028637d4-466d-d843-b0e2-699adfffc8a4', 'STU-1051', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-09-01', 143, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('9d5f1a3b-6345-9c0e-feae-4c73d79edde6', 'STU-1051', 'Prihláška na súťaž.pdf', 'Zmluva o štúdiu', 'Podpísané', '2026-03-10', 90, 'Pedagóg')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('5948724a-3e48-8c4b-cb89-051906ba850c', 'STU-1052', 'Súhlas rodiča 2025-26.pdf', 'Súhlas rodiča', 'Podpísané', '2025-09-02', 180, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('21833e7e-a47c-7253-af5f-303a6b957807', 'STU-1052', 'Lekárske potvrdenie.pdf', 'Lekárske tlačivo', 'Podpísané', '2025-09-04', 252, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('3ab3c066-8c5b-bab2-9b07-89c918ebf21b', 'STU-1052', 'Súhlas s fotami a videom.pdf', 'Súhlas s fotami a videom', 'Podpísané', '2025-09-02', 142, 'Kancelária')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('59390255-009f-66ac-681f-e7bea90f9bde', 'STU-1052', 'Zmluva o štúdiu 2.r.pdf', 'Zmluva o štúdiu', 'Podpísané', '2025-08-31', 309, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('e3b61389-0f51-4574-8975-68b5eaaed45d', 'STU-1053', 'Prihláška na konkurz.pdf', 'Zmluva o štúdiu', 'Podpísané', '2026-05-25', 205, 'Študijné')
on conflict (id) do nothing;
insert into public.ludus_documents (id, student_id, name, kind, status, uploaded_at, size_kb, added_by)
values ('142be436-c2dc-0cb3-26df-ac877c0fb030', 'STU-1053', 'Odkaz na portfólio.pdf', 'Vysvedčenie', 'Čaká sa', '2026-05-26', 64, 'Kancelária')
on conflict (id) do nothing;

-- Media
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('3b9cfdc3-00c7-271f-2920-794a26b0855a', 'STU-1042', 'Portrét — jeseň 2025', 'Portrét', '2025-10-01', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('4e6aca7f-962f-f0c5-e9d3-99aed93c8e9d', 'STU-1042', 'Bedári — 2. dejstvo', 'Foto z predstavenia', '2025-12-14', null, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('5259c3ed-9c1d-a554-cc16-e6cdda7d2079', 'STU-1042', 'Konkurzné video — Sondheim', 'Konkurzné video', '2026-01-20', 142, 'Konkurz')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('91c6faf1-b844-71c1-ce5c-a764d3fbb077', 'STU-1042', 'Kabaret — sólo', 'Video z predstavenia', '2025-12-15', 215, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('55b39b6b-2a57-4b3e-123f-0290968374f3', 'STU-1042', 'Tanečný intenzív', 'Foto z predstavenia', '2026-03-02', null, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('4f027192-ab42-3c21-404b-170aaba73d8f', 'STU-1043', 'Portrét — jar 2026', 'Portrét', '2026-03-10', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('fd4ea2b8-7f8f-a755-2017-97695c505916', 'STU-1043', 'Macbeth — hostina', 'Foto z predstavenia', '2025-11-22', null, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('8fa64bb4-29eb-9dc3-14c8-3f731ce67493', 'STU-1043', 'Monológ (video)', 'Konkurzné video', '2026-02-05', 98, 'Konkurz')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('9a354ede-0dbc-df5b-3382-f347d947d5ec', 'STU-1044', 'Portrét — jeseň 2025', 'Portrét', '2025-09-28', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('ea76b6c8-fe4c-1d87-5fdf-5eb201ee85b2', 'STU-1044', 'Súčasné sólo', 'Video z predstavenia', '2026-01-30', 184, 'Prehliadka')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('69490549-dd01-a70d-cf7e-750b4ba58571', 'STU-1044', 'Štúdiová skúška', 'Foto z predstavenia', '2026-02-18', null, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('dfc51010-3a81-1e3a-bfa5-e17753df81d4', 'STU-1044', 'Jarná prehliadka', 'Foto z predstavenia', '2026-04-05', null, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('9f9eb2db-9a74-8bd2-ebf5-d440756deb50', 'STU-1045', 'Portrét — promócia', 'Portrét', '2026-04-20', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('cb337245-fd34-a88b-2277-f36c7286b056', 'STU-1045', 'Autorská inscenácia — ''Nite''', 'Video z predstavenia', '2026-03-12', 320, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('ec0c9c64-0908-cbd7-ccdc-5b623a0afa6b', 'STU-1045', 'Prezentačné video', 'Konkurzné video', '2026-05-08', 165, 'Konkurz')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('edc629ec-5d39-d05e-e5ac-a0414be02f63', 'STU-1045', 'Foto súboru', 'Foto z predstavenia', '2026-02-28', null, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('3238cf7f-40df-7477-16ef-20c829cfbc2b', 'STU-1046', 'Konkurzné video — jarný nábor', 'Konkurzné video', '2026-05-18', 121, 'Konkurz')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('b16367bf-5c52-b0cf-9f81-aa354d92013a', 'STU-1046', 'Domáce video', 'Konkurzné video', '2026-05-10', 90, 'Konkurz')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('7516c757-fd8b-f499-ff6b-75f663e91487', 'STU-1047', 'Svetelný plán — ''Macbeth''', 'Foto z predstavenia', '2025-11-20', null, 'Produkcia')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('c491c986-1bcf-c22e-c667-f1587203d168', 'STU-1047', 'Stavba scény (timelapse)', 'Video z predstavenia', '2025-11-18', 142, 'Produkcia')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('95d5c7f7-5a49-5ccd-76de-9b875759bba1', 'STU-1048', 'Absolventský koncert', 'Video z predstavenia', '2025-06-15', 410, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('cc5349ff-8e89-69d4-2b4c-9a293b550df3', 'STU-1048', 'Portrét — profesionálny', 'Portrét', '2025-08-01', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('b451b130-ec8d-c4f8-ac5f-63a220f63713', 'STU-1048', 'Jazzový set — finále', 'Foto z predstavenia', '2025-05-30', null, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('42eb699e-604f-e7f4-018f-39fed94373b4', 'STU-1049', 'Portrét — jeseň 2025', 'Portrét', '2025-10-02', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('746b54e4-3347-0cf6-99d5-cea94f7a17b9', 'STU-1049', '42. ulica — step', 'Video z predstavenia', '2025-12-12', 240, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('edcda6aa-7ef2-3ab2-3593-592b71111fa5', 'STU-1049', 'Zo skúšky', 'Foto z predstavenia', '2026-01-15', null, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('7478aeeb-bb6c-2643-4683-a782fbca1bd2', 'STU-1050', 'Portrét — jeseň 2025', 'Portrét', '2025-10-05', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('b0060a53-7aae-e5aa-d3de-02b145ac2ae4', 'STU-1050', 'Improvizačná prehliadka', 'Video z predstavenia', '2026-02-22', 200, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('80c96a97-62be-b5af-9285-c76952b68b24', 'STU-1051', 'Portrét — jeseň 2025', 'Portrét', '2025-10-01', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('3b6ed565-efae-66b1-0ca6-fcd6b8a4ce0d', 'STU-1051', 'Áriový koncert', 'Video z predstavenia', '2026-03-18', 280, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('38f39b60-3a74-cb0d-0d74-58b945de5a30', 'STU-1051', 'Majstrovský kurz', 'Foto z predstavenia', '2026-01-25', null, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('c4a49e64-25de-6715-eece-8b7ef60dca87', 'STU-1052', 'Portrét — jeseň 2025', 'Portrét', '2025-10-03', null, 'Promo')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('9152da0b-6c52-631d-be00-91388840c12b', 'STU-1052', 'Zimná gala — pas de deux', 'Video z predstavenia', '2025-12-20', 260, 'Hlavná scéna')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('0f304521-e31d-7ec8-d609-317e6d8e77c8', 'STU-1052', 'Pri tyči', 'Foto z predstavenia', '2026-02-10', null, 'Štúdio')
on conflict (id) do nothing;
insert into public.ludus_media (id, student_id, title, kind, captured_at, duration_sec, tag)
values ('f14cec1d-3b92-793f-57d3-08707a25fd5e', 'STU-1053', 'Ukážka projekcie', 'Video z predstavenia', '2026-05-22', 150, 'Konkurz')
on conflict (id) do nothing;

-- Projects
insert into public.ludus_projects (id, title, phase, program, venue, dates, director, cast_filled, cast_total, custom)
values ('P-01', 'Bedári', 'Vybratý', 'Reklama', 'Hlavná scéna', '12. – 28. jún 2026', 'Katarína Baranová', 32, 32, false)
on conflict (id) do nothing;
insert into public.ludus_projects (id, title, phase, program, venue, dates, director, cast_filled, cast_total, custom)
values ('P-02', 'Sen noci svätojánskej', 'Vybratý', 'Film/seriál', 'Štúdiová scéna', '3. – 11. júl 2026', 'Tomáš Vavrinec', 18, 20, false)
on conflict (id) do nothing;
insert into public.ludus_projects (id, title, phase, program, venue, dates, director, cast_filled, cast_total, custom)
values ('P-03', 'Jarná tanečná prehliadka', 'Vybratý', 'Reklama', 'Tanečná sála A', '18. – 20. júl 2026', 'Elena Hudecová', 24, 24, false)
on conflict (id) do nothing;
insert into public.ludus_projects (id, title, phase, program, venue, dates, director, cast_filled, cast_total, custom)
values ('P-04', 'Kabaret', 'Konkurz', 'Reklama', 'Hlavná scéna', '26. sep – 12. okt 2026', 'Katarína Baranová', 9, 22, false)
on conflict (id) do nothing;
insert into public.ludus_projects (id, title, phase, program, venue, dates, director, cast_filled, cast_total, custom)
values ('P-05', 'Sondheim revue', 'Konkurz', 'Film/seriál', 'Štúdiová scéna', '24. – 30. okt 2026', 'Adam Tóth (študentské vedenie)', 4, 12, false)
on conflict (id) do nothing;
insert into public.ludus_projects (id, title, phase, program, venue, dates, director, cast_filled, cast_total, custom)
values ('P-06', 'Macbeth', 'Vybratý', 'Film/seriál', 'Hlavná scéna', '14. – 23. nov 2025', 'Tomáš Vavrinec', 16, 16, false)
on conflict (id) do nothing;

commit;
