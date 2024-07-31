import axios from "axios"
const secret = process.env.MP_API_SECRET; // Ensure you have this in your .env file

export const fetchEventById = async (eventId: string) => {
  if (!secret) {
    console.log("No MP secret")
    return;
  }
  try {
    if (eventId) {
      const event = await axios.get(`https://my.pureheart.org/ministryplatformapi/tables/Events`, {
        params: {
          $select: "Events.Event_Title AND Events.Event_Description",
          $filter: `Events.Event_ID=${eventId}`
        },
        headers: {
          "Authorization":  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkV4Z2VKZlgwQkFrN2I3b2VCNTFrMllDM01DdyIsImtpZCI6IkV4Z2VKZlgwQkFrN2I3b2VCNTFrMllDM01DdyJ9.eyJpc3MiOiJodHRwczovL215LnB1cmVoZWFydC5vcmcvbWluaXN0cnlwbGF0Zm9ybWFwaS9vYXV0aCIsImF1ZCI6Imh0dHBzOi8vbXkucHVyZWhlYXJ0Lm9yZy9taW5pc3RyeXBsYXRmb3JtYXBpL29hdXRoL3Jlc291cmNlcyIsImV4cCI6MTcyMjI4OTk2NSwibmJmIjoxNzIyMjg2MzY1LCJjbGllbnRfaWQiOiJQbGF0Zm9ybS5XZWIuU2VydmljZXMiLCJzY29wZSI6Imh0dHA6Ly93d3cudGhpbmttaW5pc3RyeS5jb20vZGF0YXBsYXRmb3JtL3Njb3Blcy9hbGwiLCJzdWIiOiJlYjhhZDlmMi00MjllLTRmYzUtYWQ0Yy05MzdhZGQ5YTM1MTEiLCJhdXRoX3RpbWUiOjE3MTUxOTI1NTgsImlkcCI6Imlkc3J2IiwiYXV0aF9oYXNoIjoiSnRwQXF4Vy9BekNrQzVOK2Nod1VWUT09IiwibmFtZSI6Im1icmFuZG93IiwiYW1yIjpbIjJmYSJdfQ.QwBmLV7yESR0VsysOcijxxnNjN0dAtgzjvSzr8DkP6P3gpoiBqK6J4O-_XcVjIr2937PQ7E4FxXwI6vnRDSyXhJaSfvOHLT9Uf0wwU8w0THVbOEdjvKYSnUmERgXFrzCsLxN9UHuSEuq9EYvpnw3_bCT4ANJKslGyRDmTjctcgdoOZJtw34xIK-YmTVHdJgEfwTS53bL2O0j0xlW6F_mRqD0UZfqSb8ijHclKrH9IL76Aga8TMT4tV3DSc70QCK7hGvLjuyRiNMGiIMoejmisdJsUwOLl4ukF4lKXP5RmvZEb0j56beiKK87DAFaEiDJID-XmTRWx1uzcPq-N67GbA'
        }
      })
      if (event) {
        const files = await axios.get(`https://my.pureheart.org/ministryplatformapi/files/events/${eventId}`, {
          headers: {
            "Authorization":  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkV4Z2VKZlgwQkFrN2I3b2VCNTFrMllDM01DdyIsImtpZCI6IkV4Z2VKZlgwQkFrN2I3b2VCNTFrMllDM01DdyJ9.eyJpc3MiOiJodHRwczovL215LnB1cmVoZWFydC5vcmcvbWluaXN0cnlwbGF0Zm9ybWFwaS9vYXV0aCIsImF1ZCI6Imh0dHBzOi8vbXkucHVyZWhlYXJ0Lm9yZy9taW5pc3RyeXBsYXRmb3JtYXBpL29hdXRoL3Jlc291cmNlcyIsImV4cCI6MTcyMjI4OTk2NSwibmJmIjoxNzIyMjg2MzY1LCJjbGllbnRfaWQiOiJQbGF0Zm9ybS5XZWIuU2VydmljZXMiLCJzY29wZSI6Imh0dHA6Ly93d3cudGhpbmttaW5pc3RyeS5jb20vZGF0YXBsYXRmb3JtL3Njb3Blcy9hbGwiLCJzdWIiOiJlYjhhZDlmMi00MjllLTRmYzUtYWQ0Yy05MzdhZGQ5YTM1MTEiLCJhdXRoX3RpbWUiOjE3MTUxOTI1NTgsImlkcCI6Imlkc3J2IiwiYXV0aF9oYXNoIjoiSnRwQXF4Vy9BekNrQzVOK2Nod1VWUT09IiwibmFtZSI6Im1icmFuZG93IiwiYW1yIjpbIjJmYSJdfQ.QwBmLV7yESR0VsysOcijxxnNjN0dAtgzjvSzr8DkP6P3gpoiBqK6J4O-_XcVjIr2937PQ7E4FxXwI6vnRDSyXhJaSfvOHLT9Uf0wwU8w0THVbOEdjvKYSnUmERgXFrzCsLxN9UHuSEuq9EYvpnw3_bCT4ANJKslGyRDmTjctcgdoOZJtw34xIK-YmTVHdJgEfwTS53bL2O0j0xlW6F_mRqD0UZfqSb8ijHclKrH9IL76Aga8TMT4tV3DSc70QCK7hGvLjuyRiNMGiIMoejmisdJsUwOLl4ukF4lKXP5RmvZEb0j56beiKK87DAFaEiDJID-XmTRWx1uzcPq-N67GbA'
          }
        })
        const file = files.data.find((f: any) => f.IsDefaultImage === true);
        console.log("Event", event.data, "Files", file)
        return {"Event": event.data, "Files": files.data};
      }
    }
    return;
  } catch (error) {
    console.log(error)
  }
}