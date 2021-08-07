-- SELECT devices.id, devices.device, device_status.status, device_status.created_at
-- FROM devices
-- 	LEFT OUTER JOIN (
-- 		SELECT *
-- 		FROM device_status
-- 		WHERE device_status.device = devices.device
-- 		ORDER BY device_status.created_at DESC
-- 	) AS vue_device_status ON devices.device = vue_device_status.device


		SELECT device, id, status, MAX(created_at)
		FROM device_status
		GROUP BY device, id