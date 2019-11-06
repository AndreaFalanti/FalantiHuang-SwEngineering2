abstract sig ReportStatus{}
one sig PENDING extends ReportStatus{}
one sig VALIDATED extends ReportStatus{}
one sig INVALIDATED extends ReportStatus{}

sig PhotoUrl{}
sig Address{}
sig State{}
sig PostalCode{}
sig Email{}
sig Name{}
sig LicensePlate{}
sig Password{}
sig TrafficViolation{}
sig InterventionType{}

// Simplified version of timestamp, using only int to avoid a granular subdivision of time not useful for our constraints
sig Timestamp{
	timestamp: one Int
}

sig Report{
	timestamp: one Timestamp,
	location: one Location,
	submitter: one Citizen,
	violationType: one TrafficViolation,
	vehicle: one Vehicle,
	photo: one PhotoUrl,
	supervisor: lone Authority,
	status: one ReportStatus
}

sig Location{
	// Alloy doesn't provide a Float or Double type for performance reasons, so Int is used instead (Simplified version of GPS coordinates)
	latitude: one Int,
	longitude: one Int,
	place: one Place
}

sig Place{
	address: one Address,
	city: one City
}

sig City{
	name: one Name,
	state: one State,
	postalCode: one PostalCode
}

sig Vehicle{
	licensePlate: one LicensePlate
}

sig DataRequest{
	from: one Timestamp,
	to: one Timestamp,
	locality: one City,
	violationType: lone TrafficViolation,
	validReports: set Report
}
{ from != to and from.timestamp < to.timestamp}

sig Intervention{
	location: one Location,
	type: one InterventionType
}

abstract sig User{
	email: one Email,/*
	name: one Name,
	surname: one Name,*/
	password: one Password
}
sig Municipality extends User{}
sig Authority extends User{}
sig Citizen extends User{}

fact NoVehiclesWithSameLicensePlate {
	no disj v1,v2: Vehicle | v1.licensePlate = v2.licensePlate
}

fact NoUsersWithSameEmail {
	no disj u1,u2: User | u1.email = u2.email
}

fact ReportStatusConstraint {
	all r: Report | r.supervisor = none iff r.status = PENDING
}

fact VehicleReportAggregationConstraint {
	all v: Vehicle | some r: Report | v in r.vehicle
}

fact LocationReportAggregationConstraint {
	all l: Location | some r: Report | l in r.location
}

pred show {}

run show for 3
