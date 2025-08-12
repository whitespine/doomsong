import json

# Utility script for converting raw simple-calendar exports into the data you use when 
# importing via the api

with open("public/calendar.json") as f:
    data = json.load(f)

new_notes = []
for note in data["notes"]["default"]:
    fdata = note["flags"]["foundryvtt-simple-calendar"]
    try:
        new_notes.append({
            "title": note["name"],
            "content": note["pages"][0]["text"]["content"],
            "startDate": fdata["noteData"]["startDate"],
            "endDate": fdata["noteData"]["endDate"],
            "allDay": fdata["noteData"]["allDay"] ,
            "repeats": fdata["noteData"]["repeats"],
            "categories": fdata["noteData"]["categories"],
            "userVisibility": ["default"] if len(note["ownership"]) > 1 else [],
            "remindUsers": None
        })
    except Exception as e:
        print(f"Skipping event: {e}")
        print(note)



with open("proper_calendar.js", 'w') as f:
    json.dump(new_notes, f, indent=4)