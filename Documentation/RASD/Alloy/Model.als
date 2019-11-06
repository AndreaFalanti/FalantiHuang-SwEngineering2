sig Report{
	timestamp: one Timestamp,
	location: one Location,
	address: one Address,
	submitter: one User,
	violationType: one TrafficViolation,
	vehicle: one Vehicle,
	photo: one String,		//URL to photo
	supervisor: lone Authority,
	status: one  ReportStatus
}
sig Timestamp{}
sig Location{
	//Alloy doesn't provide a Float or Double type for performance reasons, so Int is used instead
	latitude: one Int,
	longitude: one Int
}
sig Place{
	address: one String,
	city: one City
}
sig City{
	name: one String,
	state: one String,
	postalCode: one String
}
sig TrafficViolation{}
sig ReportStatus{}
sig Vehicle{
	licensePlate: one String
}
sig DataRequest{
	from: one Timestamp,
	to: one Timestamp,
	locality: one City,
	validReports: set Report
}
sig Intervention{
	location: one Location,
	type: one InterventionType
}
sig InterventionType{}
abstract sig User{
	email: one String,
	name: one String,
	surname: one String,
	password: one String
}
sig Municipality extends User{}
sig Authority extends User{}
sig Citizen extends User{}
